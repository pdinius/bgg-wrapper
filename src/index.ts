import { cleanString, generateURI } from "./lib/utils";
import { XMLAPI, XMLAPI2 } from "./lib/constants";
import { RawThingResponse, ThingOptions } from "./types/thing";
import { ThingTransformer } from "./transformers/thing";
import xmlToJson from "./lib/xmlToJson";
import { CollectionOptions, RawCollectionResponse } from "./types/collection";
import { CollectionTransformer } from "./transformers/collection";
import { AlternateResponse, AlternateResult } from "./types/general";

const isAlternateResponse = (o: object): o is AlternateResult => {
  return "message" in o;
};

export default class BGG {
  private fetchFromBgg = async <T extends object>(
    uri: string
  ): Promise<T | AlternateResult> => {
    const data = await fetch(uri);
    const text = await data.text();
    const json: T | AlternateResponse = xmlToJson(text);

    if ("message" in json) {
      return {
        status: data.status,
        message: cleanString(json.message),
      };
    } else if ("errors" in json) {
      return {
        status: data.status,
        message: cleanString(json.errors.error.message),
      };
    } else if (data.status === 200) {
      return json as T;
    } else {
      return {
        status: data.status,
        message: `Request failed with status ${data.status}.`,
      };
    }
  };

  async thing(id: string | Array<string>, options?: Partial<ThingOptions>) {
    if (Array.isArray(id)) {
      id = id.join(",");
    }

    let ratingcomments = false;
    if (options && "ratings" in options) {
      ratingcomments = true;
    }

    const uri = generateURI(XMLAPI2, "thing", {
      id,
      ratingcomments,
      ...options,
    });

    return this.fetchFromBgg<RawThingResponse>(uri).then((response) => {
      if (isAlternateResponse(response)) {
        return response;
      } else {
        return ThingTransformer(response);
      }
    });
  }

  async collection(username: string, options?: Partial<CollectionOptions>) {
    const uri = generateURI(XMLAPI2, "collection", {
      username,
      ...options,
    });

    return this.fetchFromBgg<RawCollectionResponse>(uri).then((response) => {
      if (isAlternateResponse(response)) {
        return response;
      } else {
        return CollectionTransformer(response);
      }
    });
  }
}

export {
  CollectionResponse,
  CollectionItemInformation,
} from "./types/collection";
export { ThingResponse, ThingInformation } from "./types/thing";
