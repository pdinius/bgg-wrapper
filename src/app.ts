import axios from "axios";
import xml2js from "xml2js";
import { CommandParams } from "./types";
import {
  transformRawCollectionToCollection,
  transformRawThingToBggThing,
} from "./transformers";

const parser = new xml2js.Parser();
const baseUrl = "https://boardgamegeek.com/xmlapi2/";
const transformerDict: {
  [key in keyof CommandParams]: (
    arg: CommandParams[key]["raw_response"]
  ) => CommandParams[key]["transformed_response"];
} = {
  collection: transformRawCollectionToCollection,
  thing: transformRawThingToBggThing,
};

const execute = async <T>(url: string, attempts = 5): Promise<T> => {
  if (attempts === 0) {
    throw Error("Ran out of attempts.");
  }
  try {
    const response = await axios.get(url);

    if (response.status === 202) {
      await timeout(5, "seconds");
      return execute(url, --attempts);
    }

    if (response.status === 429) {
      await timeout(15, "seconds");
      return execute(url, --attempts);
    } else if (response.status >= 400) {
      throw Error(response.statusText);
    }

    return await parser.parseStringPromise(response.data);
  } catch (e: any) {
    throw Error(e.message);
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

export const bgg = async <Command extends keyof CommandParams>(
  c: Command,
  params: CommandParams[Command]["params"]
): Promise<CommandParams[Command]["transformed_response"]> => {
  let resParams: { [key: string]: string | number } = {};

  for (let p in params) {
    if (typeof params[p] === "boolean") {
      resParams[p] = params[p] ? "1" : "0";
    } else if (Object.prototype.toString.call(params[p]) === "[object Date]") {
      const d: Date = params[p] as Date;
      resParams[p] =
        String(d.getFullYear()).slice(2) +
        String(d.getMonth()).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0");
    } else {
      resParams[p] = params[p] as any;
    }
  }

  const data = await getWithTimeout<CommandParams[Command]["raw_response"]>(c, resParams);
  return transformerDict[c](data);
};
