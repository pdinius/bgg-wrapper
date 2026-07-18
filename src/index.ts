import { generateURI, pause } from "./shared/utils";
import {
  CHUNK_DELAY,
  MAX_RETRIES,
  RETRY_DELAY_ACCEPTED,
  RETRY_DELAY_RATE_LIMIT,
  TERMS_OF_USE,
  XMLAPI2,
} from "./shared/constants";
import {
  RawThingResponse,
  ThingInformation,
  ThingOptions,
  ThingResponse,
} from "./types/thing";
import { ThingTransformer } from "./transformers/thing";
import {
  CollectionOptions,
  CollectionResponse,
  CompleteDataCollectionResponse,
  RawCollectionResponse,
} from "./types/collection";
import {
  CollectionTransformer,
  CompleteDataCollectionItemTransformer,
} from "./transformers/collection";
import { RawUserResponse, UserResponse } from "./types/user";
import { UserTransformer } from "./transformers/user";
import xmlToJson from "@phildinius/xml-to-json";
import {
  RawSearchResponse,
  SearchOptions,
  SearchResponse,
} from "./types/search";
import { SearchTransformer } from "./transformers/search";
import { BggError } from "./errors";

export { BggError } from "./errors";
export {
  CollectionOptions,
  CollectionResponse,
  CollectionItemInformation,
  CollectionStatistics,
  CollectionSubtype,
  CompleteDataCollectionResponse,
  CompleteDataCollectionItemInformation,
  CompleteStatistics,
} from "./types/collection";
export {
  ThingOptions,
  ThingResponse,
  ThingInformation,
  Statistics,
  Version,
  Comment,
  Comments,
  MarketplaceListing,
  Video,
  Videos,
  RankInformation,
  LinkInformation,
} from "./types/thing";
export { UserResponse } from "./types/user";
export {
  SearchOptions,
  SearchResponse,
  SearchResult,
} from "./types/search";
export { ThingType, NameType, LinkType, LanguageDependenceLevel } from "./types/general";

export class BGG {
  private signal: AbortSignal | undefined;
  private progressEmitter = new EventTarget();
  private authToken: string;

  constructor(props: {
    authToken: string;
    signal?: AbortSignal;
    progressListener?: (items: ThingInformation[]) => void;
    percentListener?: (percent: number) => void;
  }) {
    const { authToken, signal, progressListener, percentListener } = props;
    this.authToken = authToken;
    this.signal = signal;
    if (progressListener) {
      this.progressEmitter.addEventListener(
        "progress",
        (e: CustomEventInit<ThingInformation[]>) => {
          if (e.detail) {
            progressListener(e.detail);
          }
        },
      );
    }
    if (percentListener) {
      this.progressEmitter.addEventListener(
        "percent",
        (e: CustomEventInit<number>) => {
          if (e.detail) {
            percentListener(e.detail);
          }
        },
      );
    }
  }

  private resolveSignal(signal?: AbortSignal): AbortSignal | undefined {
    return signal ?? this.signal;
  }

  private async fetchFromBgg<T extends object>(
    uri: string,
    signal?: AbortSignal,
  ): Promise<T> {
    const response = await fetch(uri, {
      headers: { Authorization: "Bearer " + this.authToken },
      signal: this.resolveSignal(signal),
    });

    if (response.status === 200) {
      const text = await response.text();
      return xmlToJson(text) as T;
    }

    throw new BggError(`Request completed with status ${response.status}.`, {
      status: response.status,
      retriable: response.status === 202 || response.status === 429,
      details:
        response.status === 202
          ? "BGG is fetching your data, retry your request in 5~10 seconds."
          : response.status === 429
            ? "Too many requests. Please wait."
            : undefined,
    });
  }

  private async requestWithRetry<T extends object>(
    uri: string,
    signal?: AbortSignal,
  ): Promise<T> {
    const resolvedSignal = this.resolveSignal(signal);
    let attempt = 0;

    while (true) {
      try {
        return await this.fetchFromBgg<T>(uri, resolvedSignal);
      } catch (error) {
        if (isAbortError(error) || resolvedSignal?.aborted) {
          throw error;
        }

        const canRetry =
          attempt < MAX_RETRIES &&
          ((error instanceof BggError && error.retriable) ||
            isNetworkError(error));

        if (!canRetry) {
          throw error;
        }

        attempt += 1;
        const delaySeconds =
          error instanceof BggError && error.status === 429
            ? RETRY_DELAY_RATE_LIMIT
            : RETRY_DELAY_ACCEPTED;
        await pause(delaySeconds, resolvedSignal);
      }
    }
  }

  async thing(
    id: string | number | Array<string | number>,
    options?: Partial<ThingOptions>,
    signal?: AbortSignal,
  ): Promise<ThingResponse> {
    if (Array.isArray(id) && id.length === 0) {
      return {
        termsOfUse: TERMS_OF_USE,
        items: [],
      };
    }

    const chunks: (string | number)[] = [];

    if (Array.isArray(id)) {
      for (let i = 0; i < id.length; i += 20) {
        chunks.push(id.slice(i, i + 20).join(","));
      }
    } else {
      chunks.push(id);
    }

    const { ratings, ...restOptions } = options ?? {};

    const uris = chunks.map((chunkId) =>
      generateURI(XMLAPI2, "thing", {
        id: chunkId,
        ...restOptions,
        ...(ratings !== undefined ? { ratingcomments: ratings } : {}),
      }),
    );

    const resolvedSignal = this.resolveSignal(signal);
    const results: ThingResponse = {
      termsOfUse: "",
      items: [],
    };

    for (let i = 0; i < uris.length; ++i) {
      const response = await this.requestWithRetry<RawThingResponse>(
        uris[i],
        resolvedSignal,
      );
      const partial = ThingTransformer(response);
      if (!results.termsOfUse) results.termsOfUse = partial.termsOfUse;
      results.items.push(...partial.items);
      this.progressEmitter.dispatchEvent(
        new CustomEvent("progress", {
          detail: partial.items,
        }),
      );
      this.progressEmitter.dispatchEvent(
        new CustomEvent("percent", { detail: (i + 1) / uris.length }),
      );
      if (i < uris.length - 1) {
        await pause(CHUNK_DELAY, resolvedSignal);
      }
    }

    return results;
  }

  async collection(
    username: string,
    options?: Partial<CollectionOptions>,
    signal?: AbortSignal,
  ): Promise<CollectionResponse> {
    const uri = generateURI(XMLAPI2, "collection", {
      username,
      ...options,
    });
    const response = await this.requestWithRetry<RawCollectionResponse>(
      uri,
      signal,
    );
    return CollectionTransformer(response);
  }

  async collectionComplete(
    username: string,
    options?: Partial<CollectionOptions>,
    signal?: AbortSignal,
  ): Promise<CompleteDataCollectionResponse> {
    const collection = await this.collection(
      username,
      { ...options, stats: true },
      signal,
    );

    if (collection.items.length === 0) {
      return {
        termsOfUse: collection.termsOfUse,
        retrievalDate: collection.retrievalDate,
        items: [],
      };
    }

    const things = await this.thing(
      collection.items.map((item) => item.id),
      { stats: true },
      signal,
    );
    const thingsById = new Map(things.items.map((item) => [item.id, item]));

    return {
      termsOfUse: collection.termsOfUse,
      retrievalDate: collection.retrievalDate,
      items: collection.items.map((collectionItem) => {
        const thing = thingsById.get(collectionItem.id);
        if (!thing) {
          throw new BggError(
            `Missing thing data for collection item ${collectionItem.id}.`,
            { status: 0 },
          );
        }
        return CompleteDataCollectionItemTransformer(thing, collectionItem);
      }),
    };
  }

  async user(username: string, signal?: AbortSignal): Promise<UserResponse> {
    const uri = generateURI(XMLAPI2, "user", { name: username });
    const response = await this.requestWithRetry<RawUserResponse>(uri, signal);
    return UserTransformer(response);
  }

  async search(
    query: string,
    options?: Partial<SearchOptions>,
    signal?: AbortSignal,
  ): Promise<SearchResponse> {
    const uri = generateURI(XMLAPI2, "search", { query, ...options });
    const response = await this.requestWithRetry<RawSearchResponse>(
      uri,
      signal,
    );
    return SearchTransformer(response);
  }
}

const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === "AbortError";
};

const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError;
};

export default BGG;
