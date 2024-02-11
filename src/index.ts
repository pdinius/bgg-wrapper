import { parse } from "browser-xml";
import { XMLAPI, XMLAPI2 } from "./constants";
import {
  GeekListOptions,
  GeekListRawResponse,
  GeekListResponse,
} from "./types/geeklist";
import {
  SearchOptions,
  SearchRawResponse,
  SearchResponse,
} from "./types/search";
import { HotRawResponse, HotResponse } from "./types/hot";
import {
  BuddiesOptions,
  GuildsOptions,
  UserOptions,
  UserRawResponse,
  UserResponse,
} from "./types/user";
import { userTransformer } from "./transformers/user";
import { hotTransformer } from "./transformers/hot";
import { geeklistTransformer } from "./transformers/geeklist";
import { searchTransformer } from "./transformers/search";

const generateURI = (
  base: string,
  route: string,
  options?: { [key: string]: boolean | string | number }
) => {
  const params = [];
  if (options) {
    for (const [k, v] of Object.entries(options)) {
      if (typeof v === "string") {
        params.push(`${k}=${encodeURI(v)}`);
      } else if (typeof v === "boolean") {
        params.push(`${k}=${v ? 1 : 0}`);
      } else {
        params.push(`${k}=${v}`);
      }
    }
  }
  const paramString = params.length ? `?${params.join("&")}` : "";
  return base + route + paramString;
};

const pause = (seconds: number) => {
  return new Promise((res) => setTimeout(res, seconds * 1000));
};

const clean = <T extends Object>(o: T) => {
  if (typeof o !== "object") return o;

  for (const [k, v] of Object.entries(o)) {
    const key = k as keyof typeof o;
    if (v === undefined) {
      delete o[key];
    }
  }

  return o as T;
};

class BGG {
  private fetchFromBgg = async <T, U extends Object>(
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
        await pause(n);
        n = 3;
      } else if (data.status === 429) {
        console.log("429");
        await pause(10);
      }
    }

    if (data === null) {
      throw Error("Failed to fetch data from bgg.");
    }

    const text = await data.text();
    const xml = parse<T>(text);
    return clean<U>(t(xml));
  };

  thing() {}

  async user(name: string, options?: UserOptions) {
    const uri = generateURI(XMLAPI2, "user", { name, ...options });
    const res = await this.fetchFromBgg<UserRawResponse, UserResponse>(
      uri,
      0,
      userTransformer
    );
    if (!options?.buddies) {
      delete res.buddies;
    }
    if (!options?.guilds) {
      delete res.guilds;
    }
    if (!options?.hot) {
      delete res.hot;
    }
    return res;
  }

  buddies(name: string, options?: BuddiesOptions) {}

  guilds(name: string, options?: GuildsOptions) {}

  plays() {}

  collection() {}

  hot() {
    const uri = generateURI(XMLAPI2, "hot", { type: "boardgame" });
    return this.fetchFromBgg<HotRawResponse, HotResponse>(
      uri,
      1,
      hotTransformer
    );
  }

  geeklist(id: string, options?: GeekListOptions) {
    const uri = generateURI(XMLAPI, `geeklist/${id}`, options);
    return this.fetchFromBgg<GeekListRawResponse, GeekListResponse>(
      uri,
      3,
      geeklistTransformer
    );
  }

  search(query: string, options?: SearchOptions) {
    const uri = generateURI(XMLAPI2, "search", { query, ...options });
    return this.fetchFromBgg<SearchRawResponse, SearchResponse>(
      uri,
      5,
      searchTransformer
    );
  }
}

const beeg = new BGG();
const log = (o: any) => {
  console.log(JSON.stringify(o, null, 2));
};

beeg.user("phildinius", { hot: true }).then(log);

