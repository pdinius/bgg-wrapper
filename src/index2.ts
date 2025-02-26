import { parse } from "browser-xml";
import { generateURI, pause } from "./lib/utils";
import { XMLAPI, XMLAPI2 } from "./lib/constants";
import { ThingOptions } from "./types/thing2";

const memo: { [key: string]: any } = {};

export default class BGG {
  private fetchFromBgg = async (
    uri: string,
    attempts = 0
  ): Promise<unknown> => {
    if (memo[uri] !== undefined) return memo[uri];
    const data = await fetch(uri);

    switch (data.status) {
      case 200:
        const xml = await data.text();
        const json = parse(xml);
        memo[uri] = json;
        return json;
      case 202:
        await pause(5);
        return await this.fetchFromBgg(uri, attempts + 1);
      case 429:
        if (attempts === 5)
          throw Error(
            `Reached maximum attempts. Please try again momentarily.`
          );
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
    return this.fetchFromBgg(uri);
  }
}

const bgg = new BGG();
bgg.thing(["128882", "1234"]).then((data) => console.log(JSON.stringify(data, null, 2)));
