import { Command, CommandParams } from "./types";
import {
  transformRawCollectionToCollection,
  transformRawThingToThing,
} from "./transformers";
import { parse } from "browser-xml";
import { timeout } from "./utils";

const baseUrl = "https://boardgamegeek.com/xmlapi2/";
const transformerDict: {
  [key in keyof CommandParams]: (
    arg: CommandParams[key]["raw_response"]
  ) => CommandParams[key]["transformed_response"];
} = {
  collection: transformRawCollectionToCollection,
  thing: transformRawThingToThing,
};

const execute = async <T>(url: string, attempts = 5): Promise<T> => {
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
      const time = Number(response.headers.get('Retry-After'));
      if (time) {
        await timeout(time);
      } else {
        await timeout(15, "seconds");
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
      throw Error('Failed to fetch from bgg.');
    }
  }
};

const getWithTimeout = <T>(
  command: string,
  params: { [key: string]: string | number }
) => {
  // concatenate the url
  const paramsString = Object.entries(params)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
  let url = baseUrl + command;
  if (paramsString.length) url += `?${paramsString}`;

  return execute<T>(url);
};

export const bgg = async <C extends Command>(
  c: C,
  params: CommandParams[C]["params"]
): Promise<CommandParams[C]["transformed_response"]> => {
  const resParams: { [key: string]: string | number } = {};

  for (const p in params) {
    if (typeof params[p] === "boolean") {
      resParams[p] = params[p] ? "1" : "0";
    } else if (Object.prototype.toString.call(params[p]) === "[object Date]") {
      const d: Date = params[p] as Date;
      resParams[p] =
        String(d.getFullYear()).slice(2) +
        String(d.getMonth()).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0");
    } else {
      resParams[p] = params[p] as string | number;
    }
  }

  const data = await getWithTimeout<CommandParams[C]["raw_response"]>(c, resParams);
  return transformerDict[c](data);
};
