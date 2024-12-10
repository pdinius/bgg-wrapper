import { parse } from "browser-xml";
import { XMLAPI, XMLAPI2 } from "./lib/constants";
import { GeekListOptions } from "./types/geeklist";
import { SearchOptions } from "./types/search";
import { UserOptions } from "./types/user";
import { userTransformer } from "./transformers/user";
import { hotTransformer } from "./transformers/hot";
import { geeklistTransformer } from "./transformers/geeklist";
import { searchTransformer } from "./transformers/search";
import { ThingOptions, ThingResponse } from "./types/thing";
import { thingTransformer } from "./transformers/thing";
import {
  CollectionItem,
  CollectionItemWithStats,
  CollectionOptions,
  CollectionOptionsClean,
  CollectionRawItem,
  CollectionRawItemWithStats,
  CollectionRawResponse,
  CollectionResponse,
} from "./types/collection";
import {
  collectionTransformer,
  collectionTransformerWithStats,
  expansionGamesToIds,
} from "./transformers/collection";
import {
  clean,
  dateToString,
  generateURI,
  partition,
  pause,
} from "./lib/utils";
import { IError } from "./types/general";

const isError = (o: object): o is IError => {
  return Object.keys(o).length === 2 && "status" in o && "message" in o;
};

const memo: { [key: string]: any } = {};

export default class BGG {
  private fetchFromBgg = async <T, U extends Object>(
    uri: string,
    transformer: (xml: T) => U,
    timeout = 5
  ): Promise<U> => {
    if (memo[uri] !== undefined) return memo[uri];
    let attempts = 0;
    let data: Response | null = null;

    while (attempts++ < 10) {
      data = await fetch(uri);
      if (data.status === 200) {
        break;
      } else if (data.status === 202) {
        await pause(timeout);
      } else if (data.status === 429) {
        await pause(5);
      } else {
        throw Error(`Failed with status code: ${data.status}.`);
      }
    }

    if (data === null) {
      throw Error("Failed to fetch data from bgg.");
    }

    const text = await data.text();
    const xml = parse<T>(text);
    const res = clean<U>(transformer(xml));

    memo[uri] = res;
    return res;
  };

  /**
   * @param id ID number as a string for the item you'd like information for. This can be found in the url when viewing the item on boardgamegeek.com. You may also send an array of IDs.
   * @param options Any optional parameters to filter the returned information.
   * @returns A promise resolving to a JSON version of the item's data.
   */
  async thing(id: string | Array<string>, options?: ThingOptions) {
    if (Array.isArray(id)) {
      const parts = partition(id, 20);
      const res: ThingResponse = {
        items: [],
        termsofuse: "",
      };
      let idx = 0;
      for (const p of parts) {
        if (idx++ > 0) await pause(0.5);
        const uri = generateURI(XMLAPI2, "thing", {
          id: p.join(","),
          ...options,
        });
        const items = await this.fetchFromBgg(uri, thingTransformer, 0);
        res.items.push(...items.items);
        res.termsofuse = items.termsofuse;
      }
      return res;
    } else {
      const uri = generateURI(XMLAPI2, "thing", { id, ...options });
      return this.fetchFromBgg(uri, thingTransformer, 0);
    }
  }

  /**
   * @param name The username you'd like information for.
   * @param options Any optional parameters to filter the returned information.
   * @returns A promise resolving to a JSON version of the user's data.
   */
  async user(name: string, options?: UserOptions) {
    const uri = generateURI(XMLAPI2, "user", { name, ...options });
    const res = await this.fetchFromBgg(uri, userTransformer, 0);

    if (isError(res)) {
      return res;
    } else {
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
  }

  private plays() {
    // TODO: implement
  }

  /**
   * @param username Username of the user whose collection you're requesting.
   * @param options Any optional parameters to filter the returned information.
   * @returns A promise resolving to a JSON version of the user's collection.
   */
  collection(
    username: string,
    options: CollectionOptions & { stats: true }
  ): Promise<CollectionResponse<CollectionItemWithStats>>;
  collection(
    username: string,
    options?: CollectionOptions & { stats: false | undefined }
  ): Promise<CollectionResponse<CollectionItem>>;
  async collection(
    username: string,
    options?: CollectionOptions
  ): Promise<
    | CollectionResponse<CollectionItem>
    | CollectionResponse<CollectionItemWithStats>
  > {
    options ||= {};

    if (Array.isArray(options.id)) {
      options.id = options.id.join(",");
    }
    if (typeof options.modifiedsince === "string") {
      const d = Date.parse(options.modifiedsince);
      if (isNaN(d)) {
        throw Error(
          `Received "modifiedsince" value of ${options.modifiedsince} which is not a valid date.`
        );
      } else {
        options.modifiedsince = new Date(d);
      }
    }
    if (options.modifiedsince instanceof Date) {
      options.modifiedsince = dateToString(options.modifiedsince);
    }
    const uri = generateURI(XMLAPI2, "collection", {
      username,
      ...(options as CollectionOptionsClean),
    });
    const expansionOptions = { ...options };
    delete expansionOptions.excludesubtype;
    delete expansionOptions.stats;
    const expansionUri = generateURI(XMLAPI2, "collection", {
      username,
      ...({
        ...expansionOptions,
        subtype: "boardgameexpansion",
      } as CollectionOptionsClean),
    });

    const expansionIds = await this.fetchFromBgg(
      expansionUri,
      expansionGamesToIds,
      15
    );

    if (options.stats) {
      return this.fetchFromBgg(uri, collectionTransformerWithStats(expansionIds), 15);
    } else {
      return this.fetchFromBgg(
        uri,
        collectionTransformer(expansionIds),
        15
      );
    }
  }

  /**
   * @returns A promise resolving to a JSON version of boardgamegeek's current hot games data.
   */
  hot() {
    const uri = generateURI(XMLAPI2, "hot", { type: "boardgame" });
    return this.fetchFromBgg(uri, hotTransformer, 1);
  }

  /**
   * @param id ID number as a string for the geeklist you'd like information for. This can be found in the url when viewing the geeklist on boardgamegeek.com.
   * @param options Any optional parameters to filter the returned information.
   * @returns A promise resolving to a JSON version of the geeklist's data.
   */
  geeklist(id: string, options?: GeekListOptions) {
    const uri = generateURI(XMLAPI, `geeklist/${encodeURI(id)}`, options);
    return this.fetchFromBgg(uri, geeklistTransformer, 3);
  }

  /**
   * @param query A string query to search boardgamegeek.
   * @param options Any optional parameters to filter the returned information.
   * @returns A promise resolving to a JSON version of the search results.
   */
  search(query: string, options?: SearchOptions) {
    const uri = generateURI(XMLAPI2, "search", { query, ...options });
    return this.fetchFromBgg(uri, searchTransformer, 5);
  }
}
