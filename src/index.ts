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

const execute = async <T>(url: string, attempts = MAX_ATTEMPTS): Promise<T> => {
  if (attempts === 0) {
    throw Error("Ran out of attempts.");
  }
  try {
    const response = await fetch(url);

    if (response.status === 202) {
      await timeout(5, "seconds");
      return execute<T>(url, --attempts);
    }

    if (response.status === 429) {
      const time = Number(response.headers.get("Retry-After"));
      if (time) {
        await timeout(time);
      } else {
        await timeout(20, "seconds");
      }
      return execute(url, --attempts);
    } else if (response.status >= 400) {
      throw Error(await response.text());
    }

    const data = await response.text();
    return parse<T>(data);
  } catch (e) {
    if (e instanceof Error) {
      throw Error(e.message);
    } else {
      throw Error("Failed to fetch from bgg.");
    }
  }
};

const getWithTimeout = async <C extends Command>(
  command: C,
  params: { [key: string]: string | number },
  transformer: TransformerFunction<C>
) => {
  // concatenate the url
  const paramsString = Object.entries(params)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
  let url = baseUrl + command;
  if (paramsString.length) url += `?${paramsString}`;

  let cacheItem: string | null = "";
  if (typeof window !== "undefined") {
    cacheItem = localStorage.getItem(url);
  }

  if (cacheItem) {
    return JSON.parse(cacheItem);
  } else {
    const res = transformer(await execute<CommandParams[C]["raw_response"]>(url));
    if (typeof window !== "undefined") localStorage.setItem(url, JSON.stringify(res));
    return res;
  }
};

export const bgg = <C extends Command>(
  c: C,
  params: CommandParams[C]["params"]
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

  return getWithTimeout(c, resParams, transformerDict[c]);
};
