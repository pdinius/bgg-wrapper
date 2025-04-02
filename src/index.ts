import { cleanString, generateURI, pause } from "./shared/utils";
import { XMLAPI, XMLAPI2, MAX_RETRIES } from "./shared/constants";
import {
  RawThingResponse,
  ThingInformation,
  ThingOptions,
  ThingResponse,
} from "./types/thing";
import {
  ThingTransformer,
  TruncatedThingTransformer,
} from "./transformers/thing";
import xmlToJson from "./shared/xmlToJson";
import {
  CollectionOptions,
  CollectionResponse,
  RawCollectionResponse,
} from "./types/collection";
import { CollectionTransformer } from "./transformers/collection";
import { AlternateResponse, AlternateResult } from "./types/general";
import { RawUserResponse } from "./types/user";
import { UserTransformer } from "./transformers/user";

export {
  CollectionResponse,
  CollectionItemInformation,
  CompleteDataCollectionResponse,
  CompleteDataCollectionItemInformation,
} from "./types/collection";
export {
  ThingResponse,
  ThingInformation,
  TruncatedThingInformation,
} from "./types/thing";
export { UserResponse } from "./types/user";

export default class BGG {
  private signal: AbortSignal | undefined;
  private progressEmitter = new EventTarget();
  private retries = 0;

  constructor(
    props?: Partial<{
      signal: AbortSignal;
      progressListener: (items: ThingInformation[]) => void;
      percentListener: (percent: number) => void;
    }>
  ) {
    if (props === undefined) return;
    const { signal, progressListener, percentListener } = props;
    this.signal = signal;
    if (progressListener) {
      this.progressEmitter.addEventListener(
        "progress",
        (e: CustomEventInit<ThingInformation[]>) => {
          if (e.detail) {
            progressListener(e.detail);
          }
        }
      );
    }
    if (percentListener) {
      this.progressEmitter.addEventListener(
        "percent",
        (e: CustomEventInit<number>) => {
          if (e.detail) {
            percentListener(e.detail);
          }
        }
      );
    }
  }

  private fetchFromBgg = async <T extends object>(uri: string): Promise<T> => {
    const data = await fetch(uri, { signal: this.signal });
    const text = await data.text();
    const json: T | AlternateResponse = xmlToJson(text);

    if ("message" in json) {
      throw {
        status: data.status,
        message: cleanString(json.message),
      };
    } else if ("errors" in json) {
      throw {
        status: data.status,
        message: cleanString(json.errors.error.message),
      };
    } else if (data.status === 200) {
      return json as T;
    } else {
      throw {
        status: data.status,
        message: `Request failed with status ${data.status}.`,
      };
    }
  };

  private handleError = (e: AlternateResult) => {
    if (
      "status" in e &&
      ++this.retries < MAX_RETRIES &&
      [202, 429].includes(e.status)
    ) {
      return;
    }
    if (this.retries >= MAX_RETRIES) {
      throw Error("Reached maximum retries");
    } else {
      throw e;
    }
  };

  async thing(
    id: string | number | Array<string | number>,
    options?: Partial<ThingOptions>
  ) {
    this.retries = 0;
    const chunks: (string | number)[] = [];

    if (Array.isArray(id)) {
      for (let i = 0; i < id.length; i += 20) {
        chunks.push(id.slice(i, i + 20).join(","));
      }
    } else {
      chunks.push(id);
    }

    let ratingcomments = false;
    if (options && "ratings" in options) {
      ratingcomments = true;
    }

    let truncated = false;
    if (options && "truncated" in options) {
      truncated = true;
      delete options.truncated;
    }

    const uris = chunks.map((id) =>
      generateURI(XMLAPI2, "thing", {
        id,
        ratingcomments,
        ...options,
      })
    );

    const results: ThingResponse = {
      termsOfUse: "",
      items: [],
    };
    for (let i = 0; i < uris.length; ++i) {
      const uri = uris[i];
      try {
        const response = await this.fetchFromBgg<RawThingResponse>(uri);
        const partial = ThingTransformer(response);
        if (!results.termsOfUse) results.termsOfUse = partial.termsOfUse;
        results.items.push(...partial.items);
        this.progressEmitter.dispatchEvent(
          new CustomEvent("progress", {
            detail: truncated
              ? partial.items.map(TruncatedThingTransformer)
              : partial.items,
          })
        );
        this.progressEmitter.dispatchEvent(
          new CustomEvent("percent", { detail: i / uris.length })
        );
        if (i < uris.length - 1) {
          await pause(0.5);
        }
      } catch (e) {
        this.handleError(e as AlternateResult);
        console.log("pausing for 5 seconds");
        await pause(5);
        --i;
        continue;
      }
    }
    this.progressEmitter.dispatchEvent(
      new CustomEvent("percent", { detail: 1 })
    );
    return results;
  }

  async truncatedThing(id: string | number | Array<string | number>) {
    const thingResponse = await this.thing(id, {
      stats: true,
      truncated: true,
    });
    return thingResponse.items.map(TruncatedThingTransformer);
  }

  async collection(
    username: string,
    options?: Partial<CollectionOptions>
  ): Promise<CollectionResponse> {
    this.retries = 0;
    const uri = generateURI(XMLAPI2, "collection", {
      username,
      ...options,
    });

    try {
      const response = await this.fetchFromBgg<RawCollectionResponse>(uri);
      return CollectionTransformer(response);
    } catch (e) {
      this.handleError(e as AlternateResult);
      await pause(5);
      return this.collection(username, options);
    }
  }

  async user(username: string) {
    this.retries = 0;
    const uri = generateURI(XMLAPI2, "user", { name: username });
    const response = await this.fetchFromBgg<RawUserResponse>(uri);
    return UserTransformer(response);
  }
}

const bgg = new BGG();
bgg.thing(295945, { stats: true }).then((c) => {
  return c.items.map(
    ({
      id,
      type,
      name,
      image,
      thumbnail,
      yearPublished,
      minPlayers,
      maxPlayers,
      minPlayTime,
      maxPlayTime,
      suggestedNumPlayersPoll,
      languageDependencePoll,
      expands,
      expansions,
      designers,
      publishers,
      artists,
      categories,
      mechanics,
      families,
      reimplements,
      reimplementedBy,
      statistics,
    }) => {
      return {
        retrievedOn: new Date(),
        _id: id,
        type,
        name,
        image,
        thumbnail,
        yearPublished,
        minPlayers,
        maxPlayers,
        minPlayTime,
        maxPlayTime,
        bestWith: Object.entries(suggestedNumPlayersPoll).reduce(
          (a: number[], [playerCount, { best, recommended, notRecommended }]) =>
            best > recommended && best > notRecommended
              ? [...a, +playerCount]
              : a,
          []
        ),
        recommendedWith: Object.entries(suggestedNumPlayersPoll).reduce(
          (a: number[], [playerCount, { best, recommended, notRecommended }]) =>
            best + recommended > notRecommended ? [...a, +playerCount] : a,
          []
        ),
        languageDependence: languageDependencePoll.reduce((a, b) =>
          a.votes > b.votes ? a : b
        ).value,
        expands: expands.map((e) => e.id),
        expansions: expansions.map((e) => e.id),
        designers: designers.map((e) => e.id),
        publishers: publishers.map((e) => e.id),
        artists: artists.map((e) => e.id),
        categories: categories.map((e) => e.id),
        mechanics: mechanics.map((e) => e.id),
        families: families.map((e) => e.id),
        reimplements: reimplements.map((e) => e.id),
        reimplementedBy: reimplementedBy.map((e) => e.id),
        usersRated: statistics?.usersRated,
        averageRating: statistics?.averageRating,
        geekRating: statistics?.geekRating,
        rank: statistics?.ranks?.find((r) => r.id === 1)?.rank,
        numOwned: statistics?.owned,
        numTrading: statistics?.trading,
        numWantInTrade: statistics?.wanting,
        numWishing: statistics?.wishing,
        weight: statistics?.weight,
      };
    }
  );
}).then(console.log);
