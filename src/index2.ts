import { parse } from "browser-xml";
import { generateURI, pause } from "./lib/utils";
import { XMLAPI, XMLAPI2 } from "./lib/constants";
import { RawThingResponse, ThingOptions } from "./types/thing2";
import { ThingTransformer } from "./transformers/thing2";

const memo: { [key: string]: any } = {};

export default class BGG {
  private fetchFromBgg = async <T>(uri: string, attempts = 0): Promise<T> => {
    if (memo[uri] !== undefined) return memo[uri];
    const data = await fetch(uri, {
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    });
    if (attempts === 5 && data.status !== 200) {
      throw Error(`Reached maximum attempts. Please try again momentarily.`);
    }

    switch (data.status) {
      case 200:
        const text = await data.text();
        const json = parse(text);
        memo[uri] = json;
        return json as T;
      case 202:
        await pause(5);
        return await this.fetchFromBgg(uri, attempts + 1);
      case 429:
        await pause(10);
        return await this.fetchFromBgg(uri, attempts + 1);
      default:
        throw Error(`Unexpected status ${data.status} occurred.`);
    }
  };

  async thing(id: string | Array<string>, options?: ThingOptions) {
    if (Array.isArray(id)) {
      id = id.join(",");
    }
    const uri = generateURI(XMLAPI2, "thing", { id });
    return this.fetchFromBgg<RawThingResponse>(uri).then(ThingTransformer);
  }
}

const bgg = new BGG();
bgg
  .thing(["128882", "1234"])
  .then((json) => console.log(JSON.stringify(json, null, 2)));
