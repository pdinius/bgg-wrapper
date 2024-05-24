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
import { UserOptions, UserRawResponse, UserResponse } from "./types/user";
import { userTransformer } from "./transformers/user";
import { hotTransformer } from "./transformers/hot";
import { geeklistTransformer } from "./transformers/geeklist";
import { searchTransformer } from "./transformers/search";
import { clean, generateURI, log, pause } from "./helpers";
import { ThingOptions, ThingResponse } from "./types/thing";
import { thingTransformer } from "./transformers/thing";

export default class BGG {
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

  /**
   * @param id ID number as a string for the item you'd like information for. This can be found in the url when viewing the item on boardgamegeek.com. You may also send an array of IDs.
   * @param options Any optional parameters to filter the returned information.
   * @returns A promise resolving to a JSON version of the item's data.
   */
  thing<T extends ThingOptions>(id: string | Array<string>, options?: T): Promise<ThingResponse> {
    if (options) {
      if (
        options?.pagesize &&
        (options.pagesize < 10 ||
          options.pagesize > 100 ||
          options.pagesize % 1)
      ) {
        throw Error(
          "pagesize option must be an integer between 10 and 100 inclusive."
        );
      }
    }
    const uri = generateURI(XMLAPI2, "thing", {
      id: Array.isArray(id) ? id.join(",") : id,
      ...options,
    });
    return this.fetchFromBgg(uri, 0, thingTransformer);
  }

  /**
   * @param name The username you'd like information for.
   * @param options Any optional parameters to filter the returned information.
   * @returns A promise resolving to a JSON version of the user's data.
   */
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

  plays() {
    // TODO: implement
  }

  collection() {
    // TODO: implement
  }

  /**
   * @returns A promise resolving to a JSON version of boardgamegeek's current hot games data.
   */
  hot() {
    const uri = generateURI(XMLAPI2, "hot", { type: "boardgame" });
    return this.fetchFromBgg<HotRawResponse, HotResponse>(
      uri,
      1,
      hotTransformer
    );
  }

  /**
   * @param id ID number as a string for the geeklist you'd like information for. This can be found in the url when viewing the geeklist on boardgamegeek.com.
   * @param options Any optional parameters to filter the returned information.
   * @returns A promise resolving to a JSON version of the geeklist's data.
   */
  geeklist(id: string, options?: GeekListOptions) {
    const uri = generateURI(XMLAPI, `geeklist/${id}`, options);
    return this.fetchFromBgg<GeekListRawResponse, GeekListResponse>(
      uri,
      3,
      geeklistTransformer
    );
  }

  /**
   * @param query A string query to search boardgamegeek.
   * @param options Any optional parameters to filter the returned information.
   * @returns A promise resolving to a JSON version of the search results.
   */
  search(query: string, options?: SearchOptions) {
    const uri = generateURI(XMLAPI2, "search", { query, ...options });
    return this.fetchFromBgg<SearchRawResponse, SearchResponse>(
      uri,
      5,
      searchTransformer
    );
  }
}
