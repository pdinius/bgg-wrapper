import { cleanString, generateURI, pause } from "./lib/utils";
import { XMLAPI, XMLAPI2 } from "./lib/constants";
import { RawThingResponse, ThingOptions, ThingResponse } from "./types/thing";
import { ThingTransformer } from "./transformers/thing";
import xmlToJson from "./lib/xmlToJson";
import { CollectionOptions, CollectionResponse, RawCollectionResponse } from "./types/collection";
import {
  CollectionTransformer,
  MegaCollectionTransformer,
} from "./transformers/collection";
import { AlternateResponse, AlternateResult } from "./types/general";

export {
  CollectionResponse,
  CollectionItemInformation,
  MegaCollectionResponse,
  MegaCollectionItemInformation,
} from "./types/collection";
export { ThingResponse, ThingInformation } from "./types/thing";

export default class BGG {
  private fetchFromBgg = async <T extends object>(uri: string): Promise<T> => {
    const data = await fetch(uri);
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

  async thing(
    id: string | number | Array<string | number>,
    options?: Partial<ThingOptions>
  ) {
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
        if (i < uris.length - 1) {
          pause(500);
        }
      } catch (e: unknown) {
        const { status } = e as AlternateResult;
        if (status === 429) {
          await pause(5000);
          --i;
          continue;
        } else {
          throw e;
        }
      }
    }
    return results;
  }

  async collection(username: string, options?: Partial<CollectionOptions>) {
    const uri = generateURI(XMLAPI2, "collection", {
      username,
      ...options,
    });

    const response = await this.fetchFromBgg<RawCollectionResponse>(uri);
    return CollectionTransformer(response);
  }

  async addCompleteDataToCollection(cr: CollectionResponse) {
    const ids = cr.items.map((v) => v.id);
    const thingResponse = await this.thing(ids, { stats: true });

    return MegaCollectionTransformer(cr, thingResponse.items);
  }
}
