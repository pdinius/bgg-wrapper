import { cleanString, generateURI, pause } from "./lib/utils";
import { XMLAPI, XMLAPI2 } from "./lib/constants";
import { RawThingResponse, ThingOptions, ThingResponse } from "./types/thing";
import { ThingTransformer } from "./transformers/thing";
import xmlToJson from "./lib/xmlToJson";
import {
  CollectionItemInformation,
  CollectionOptions,
  CollectionResponse,
  RawCollectionResponse,
} from "./types/collection";
import {
  CollectionTransformer,
  CompleteDataCollectionTransformer,
} from "./transformers/collection";
import { AlternateResponse, AlternateResult } from "./types/general";
import { RawUserResponse } from "./types/user";
import { UserTransformer } from "./transformers/user";

export {
  CollectionResponse,
  CollectionItemInformation,
  CompleteDataCollectionResponse,
  CompleteDataCollectionItemInformation,
} from "./types/collection";
export { ThingResponse, ThingInformation } from "./types/thing";
export { UserResponse } from "./types/user";

const MAX_RETRIES = 20;

export default class BGG {
  private signal: AbortSignal | undefined;
  private percentEmitter = new EventTarget();
  private retries = 0;

  constructor(
    props?: Partial<{
      signal: AbortSignal;
      progressListener: (n: number) => void;
    }>
  ) {
    if (props === undefined) return;
    const { signal, progressListener } = props;
    this.signal = signal;
    if (progressListener) {
      this.percentEmitter.addEventListener(
        "percent-updated",
        (e: CustomEventInit<number>) => {
          if (e.detail) {
            progressListener(e.detail);
          }
        }
      );
    }
  }

  private fetchFromBgg = async <T extends object>(uri: string): Promise<T> => {
    const data = await fetch(uri, { signal: this.signal });
    const text = await data.text();
    const json: T | AlternateResponse = xmlToJson(text);

    if ("message" in json) {
      throw {
        status: data.status,
        message: cleanString(json.message),
      };
    } else if ("errors" in json) {
      throw {
        status: data.status,
        message: cleanString(json.errors.error.message),
      };
    } else if (data.status === 200) {
      return json as T;
    } else {
      throw {
        status: data.status,
        message: `Request failed with status ${data.status}.`,
      };
    }
  };

  private handleError = (e: AlternateResult) => {
    if ("status" in e) {
      if (
        ++this.retries < MAX_RETRIES &&
        (e.status === 429 || e.status === 202)
      )
        return;
    }
    const oldRetries = this.retries;
    this.retries = 0;
    if (oldRetries === MAX_RETRIES) {
      throw Error("Reached maximum retries");
    } else {
      throw e;
    }
  };

  async thing(
    id: string | number | Array<string | number>,
    options?: Partial<ThingOptions>
  ) {
    this.percentEmitter.dispatchEvent(
      new CustomEvent("percent-updated", { detail: 0 })
    );
    const chunks: (string | number)[] = [];

    if (Array.isArray(id)) {
      for (let i = 0; i < id.length; i += 20) {
        chunks.push(id.slice(i, i + 20).join(","));
      }
    } else {
      chunks.push(id);
    }

    let ratingcomments = false;
    if (options && "ratings" in options) {
      ratingcomments = true;
    }

    const uris = chunks.map((id) =>
      generateURI(XMLAPI2, "thing", {
        id,
        ratingcomments,
        ...options,
      })
    );

    const results: ThingResponse = {
      termsOfUse: "",
      items: [],
    };
    for (let i = 0; i < uris.length; ++i) {
      const uri = uris[i];
      try {
        const response = await this.fetchFromBgg<RawThingResponse>(uri);
        const partial = ThingTransformer(response);
        if (!results.termsOfUse) results.termsOfUse = partial.termsOfUse;
        results.items.push(...partial.items);
        this.percentEmitter.dispatchEvent(
          new CustomEvent("percent-updated", { detail: i / uris.length })
        );
        if (i < uris.length - 1) {
          await pause(0.5);
        }
      } catch (e) {
        this.handleError(e as AlternateResult);
        await pause(5);
        --i;
        continue;
      }
    }
    this.percentEmitter.dispatchEvent(
      new CustomEvent("percent-updated", { detail: 1 })
    );
    return results;
  }

  async collection(
    username: string,
    options?: Partial<CollectionOptions>
  ): Promise<CollectionResponse> {
    const uri = generateURI(XMLAPI2, "collection", {
      username,
      ...options,
    });

    try {
      const response = await this.fetchFromBgg<RawCollectionResponse>(uri);
      return CollectionTransformer(response);
    } catch (e) {
      this.handleError(e as AlternateResult);
      await pause(5);
      return this.collection(username, options);
    }
  }

  async addCompleteDataToCollectionItems(items: CollectionItemInformation[]) {
    if (items.some((item) => item.statistics === undefined)) {
      throw Error(
        `"stats" option on collection must be set to true to generate complete data collection.`
      );
    }
    const ids = items.map((v) => v.id);
    const thingResponse = await this.thing(ids, { stats: true });

    return CompleteDataCollectionTransformer(items, thingResponse.items);
  }

  async user(username: string) {
    const uri = generateURI(XMLAPI2, "user", { name: username });
    const response = await this.fetchFromBgg<RawUserResponse>(uri);
    return UserTransformer(response);
  }
}
