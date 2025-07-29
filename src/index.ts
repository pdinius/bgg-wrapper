import { generateURI, pause } from "./shared/utils";
import { TERMS_OF_USE, XMLAPI, XMLAPI2 } from "./shared/constants";
import {
  RawThingResponse,
  ThingInformation,
  ThingOptions,
  ThingResponse,
} from "./types/thing";
import { ThingTransformer } from "./transformers/thing";
import {
  CollectionOptions,
  CollectionResponse,
  RawCollectionResponse,
} from "./types/collection";
import { CollectionTransformer } from "./transformers/collection";
import { RawUserResponse } from "./types/user";
import { UserTransformer } from "./transformers/user";
import xmlToJson from "@phildinius/xml-to-json";

export {
  CollectionResponse,
  CollectionItemInformation,
  CompleteDataCollectionResponse,
  CompleteDataCollectionItemInformation,
} from "./types/collection";
export { ThingResponse, ThingInformation } from "./types/thing";
export { UserResponse } from "./types/user";

export default class BGG {
  private signal: AbortSignal | undefined;
  private progressEmitter = new EventTarget();

  constructor(
    props?: Partial<{
      signal: AbortSignal;
      progressListener: (items: ThingInformation[]) => void;
      percentListener: (percent: number) => void;
    }>
  ) {
    if (props === undefined) return;
    const { signal, progressListener, percentListener } = props;
    this.signal = signal;
    if (progressListener) {
      this.progressEmitter.addEventListener(
        "progress",
        (e: CustomEventInit<ThingInformation[]>) => {
          if (e.detail) {
            progressListener(e.detail);
          }
        }
      );
    }
    if (percentListener) {
      this.progressEmitter.addEventListener(
        "percent",
        (e: CustomEventInit<number>) => {
          if (e.detail) {
            percentListener(e.detail);
          }
        }
      );
    }
  }

  private fetchFromBgg = async <T extends object>(uri: string): Promise<T> => {
    const data = await fetch(uri, { signal: this.signal });
    const text = await data.text();
    const json: T = xmlToJson(text);

    if (data.status === 200) {
      return json as T;
    } else {
      throw {
        status: data.status,
        message: `Request completed with status ${data.status}.`,
        details:
          data.status === 202
            ? "BGG is fetching your data, retry your request in 5~10 seconds."
            : data.status === 429
            ? "Too many requests. Please wait."
            : undefined,
      };
    }
  };

  async thing(
    id: string | number | Array<string | number>,
    options?: Partial<ThingOptions>
  ): Promise<ThingResponse> {
    if (Array.isArray(id) && id.length === 0) {
      return {
        termsOfUse: TERMS_OF_USE,
        items: [],
      };
    }
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
        this.progressEmitter.dispatchEvent(
          new CustomEvent("progress", {
            detail: partial.items,
          })
        );
        this.progressEmitter.dispatchEvent(
          new CustomEvent("percent", { detail: i / uris.length })
        );
        if (i < uris.length - 1) {
          await pause(2);
        }
      } catch (e) {
        console.log(e);
        console.log("pausing for 5 seconds");
        await pause(5);
        --i;
        continue;
      }
    }
    this.progressEmitter.dispatchEvent(
      new CustomEvent("percent", { detail: 1 })
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
      await pause(5);
      return this.collection(username, options);
    }
  }

  async user(username: string) {
    const uri = generateURI(XMLAPI2, "user", { name: username });
    const response = await this.fetchFromBgg<RawUserResponse>(uri);
    return UserTransformer(response);
  }
}
