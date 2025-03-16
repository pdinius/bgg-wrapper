import { cleanString, generateURI, pause } from "./lib/utils";
import { XMLAPI, XMLAPI2 } from "./lib/constants";
import { RawThingResponse, ThingOptions } from "./types/thing2";
import { ThingTransformer } from "./transformers/thing2";
import { xmlToJson } from "./lib/xmlToJson";

const memo: { [key: string]: any } = {};
interface AlternateResult {
  status: number;
  message: string;
}

type AlternateResponse =
  | {
      message: string;
    }
  | {
      errors: { error: { message: string } };
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

    return this.fetchFromBgg<RawThingResponse>(uri); //.then(ThingTransformer);
  }

  async collection(username: string) {
    const uri = generateURI(XMLAPI2, "collection", {
      username,
    });

    return this.fetchFromBgg<RawThingResponse>(uri); //.then(ThingTransformer);
  }
}

const bgg = new BGG();
bgg.collection("carol81").then(console.log);
