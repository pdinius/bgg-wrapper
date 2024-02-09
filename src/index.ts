import { Command, CommandParams } from "./types/types";
import {
  transformRawCollectionToCollection,
  transformRawPlaysToPlays,
  transformRawSearchToSearch,
  transformRawThingToThing,
} from "./transformers";
import { parse } from "browser-xml";
import { timeout } from "./utils";
import moment from "moment";
import { GeekListOptions, GeekListRawResponse, GeekListResponse } from "./types/types2";
import { geeklistTransformer } from "./transformers2";

const MAX_ATTEMPTS = 10;

type TransformerFunction<K extends Command> = (
  arg: CommandParams[K]["raw_response"]
) => CommandParams[K]["transformed_response"];

const baseUrl = "https://boardgamegeek.com/xmlapi2/";
const transformerDict: {
  [key in Command]: TransformerFunction<key>;
} = {
  collection: transformRawCollectionToCollection,
  thing: transformRawThingToThing,
  plays: transformRawPlaysToPlays,
  search: transformRawSearchToSearch,
};

const execute = async <T>(
  url: string,
  attempts = MAX_ATTEMPTS,
  attempt = 1
): Promise<T> => {
  if (attempts === 0) {
    throw Error("Ran out of attempts.");
  }
  try {
    console.log(`Attempt #${attempt}. ${attempts} attempts remaining.`);
    const response = await fetch(url);

    if (response.status === 202) {
      await timeout(5, "seconds");
      return execute(url, --attempts, ++attempt);
    }
    if (response.status >= 400) {
      throw Error(await response.text());
    }

    const data = await response.text();

    return parse<T>(data);
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      console.log("Backing off for 15 seconds.");
      await timeout(15, "seconds");
      return execute(url, --attempts, ++attempt);
    } else {
      // should never get here
      throw Error("Failed to fetch from bgg.");
    }
  }
};

const getWithTimeout = async <C extends Command>(
  command: C,
  params: { [key: string]: string | number },
  transformer: TransformerFunction<C>,
  useCache: boolean
) => {
  // concatenate the url
  const paramsString = Object.entries(params)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
  let url = baseUrl + command;
  if (paramsString.length) url += `?${paramsString}`;

  let cacheItem: string | null = "";
  if (useCache && typeof window !== "undefined") {
    cacheItem = localStorage.getItem(url);
  }

  if (cacheItem) {
    return JSON.parse(cacheItem);
  } else {
    const res = transformer(
      await execute<CommandParams[C]["raw_response"]>(url)
    );
    if (typeof window !== "undefined")
      localStorage.setItem(url, JSON.stringify(res));
    return res;
  }
};

export const bgg = <C extends Command>(
  c: C,
  params: CommandParams[C]["params"],
  useCache = true
): Promise<CommandParams[C]["transformed_response"]> => {
  const resParams: { [key: string]: string | number } = {};

  for (const p in params) {
    const el = params[p];
    if (typeof el === "boolean") {
      resParams[p] = el ? "1" : "0";
    } else if (el instanceof Date) {
      resParams[p] = moment(el).format("YY-MM-DD%20HH:mm:ss");
    } else {
      resParams[p] = el as string | number;
    }
  }

  return getWithTimeout(c, resParams, transformerDict[c], useCache);
};

class BGG {
  private pause = (seconds: number) => {
    return new Promise((res) => setTimeout(res, seconds * 1000));
  };

  private fetchFromBgg = async <T, U>(
    uri: string,
    n: number,
    t: (xml: T) => U
  ) => {
    let attempts = 0;
    let data: Response | null = null;

    while (attempts++ < 10) {
      data = await fetch(uri);
      if (data.status === 200) {
        break;
      } else if (data.status === 202) {
        console.log("202");
        await this.pause(n);
        n = 3;
      } else if (data.status === 429) {
        console.log("429");
        await this.pause(10);
      }
    }

    if (data === null) {
      throw Error("Failed to fetch data from bgg.");
    }

    const text = await data.text();
    const xml = parse<T>(text);
    return t(xml);
  };

  private generateURI(
    base: string,
    id: string,
    options?: { [key: string]: boolean | string | number }
  ) {
    const params = [];
    if (options) {
      for (const [k, v] of Object.entries(options)) {
        params.push(`${k}=${typeof v === "boolean" ? (v ? 1 : 0) : v}`);
      }
    }
    const paramString = params.length ? `?${params.join("&")}` : "";
    return base + id + paramString;
  }

  thing() {}

  user() {}

  plays() {}

  collection() {}

  hot() {}

  geeklist(id: string, options?: GeekListOptions) {
    const uri = this.generateURI(
      "https://boardgamegeek.com/xmlapi/geeklist/",
      id,
      options
    );
    return this.fetchFromBgg<GeekListRawResponse, GeekListResponse>(
      uri,
      3,
      geeklistTransformer
    );
  }

  search() {}
}

const { geeklist } = new BGG();

geeklist("330499", { comments: true });
