import { generateURI, pause } from "./shared/utils";
import {
  CHUNK_DELAY,
  GEEKDO_API,
  MAX_RETRIES,
  RETRY_DELAY_ACCEPTED,
  RETRY_DELAY_RATE_LIMIT,
  TERMS_OF_USE,
  XMLAPI,
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
import { GeeklistResponse, RawGeeklistResponse } from "./types/geeklist";
import { GeeklistTransformer } from "./transformers/geeklist";
import { RawGeekdoImageResponse } from "./types/image";
import { BggError } from "./errors";
import {
  normalizeThingOptions,
  stableSerialize,
  ThingMemoCache,
} from "./shared/memo";

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
export { GeeklistResponse, GeeklistItemInformation } from "./types/geeklist";
export { ThingType, NameType, LinkType, LanguageDependenceLevel } from "./types/general";

export class BGG {
  private signal: AbortSignal | undefined;
  private progressEmitter = new EventTarget();
  private authToken: string;
  private memoize: boolean;
  private thingCache = new ThingMemoCache();
  private responseCache = new Map<string, unknown>();

  constructor(props: {
    authToken: string;
    signal?: AbortSignal;
    /** When true, cache transformed JSON responses in memory for this instance. */
    memoize?: boolean;
    progressListener?: (items: ThingInformation[]) => void;
    percentListener?: (percent: number) => void;
  }) {
    const {
      authToken,
      signal,
      memoize = false,
      progressListener,
      percentListener,
    } = props;
    this.authToken = authToken;
    this.signal = signal;
    this.memoize = memoize;
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

  /** Clears all memoized responses for this client instance. */
  clearMemo(): void {
    this.thingCache.clear();
    this.responseCache.clear();
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

  private async fetchJsonFromGeekdo<T extends object>(
    uri: string,
    signal?: AbortSignal,
  ): Promise<T> {
    const response = await fetch(uri, {
      headers: { Authorization: "Bearer " + this.authToken },
      signal: this.resolveSignal(signal),
    });

    if (response.status === 200) {
      return (await response.json()) as T;
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
    fetchFn?: (uri: string, signal?: AbortSignal) => Promise<T>,
  ): Promise<T> {
    const resolvedSignal = this.resolveSignal(signal);
    const doFetch =
      fetchFn ?? ((u, s) => this.fetchFromBgg<T>(u, s));
    let attempt = 0;

    while (true) {
      try {
        return await doFetch(uri, resolvedSignal);
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

  private getCachedResponse<T>(key: string): T | undefined {
    if (!this.memoize) return undefined;
    const hit = this.responseCache.get(key);
    return hit === undefined ? undefined : (structuredClone(hit) as T);
  }

  private setCachedResponse<T>(key: string, value: T): T {
    if (this.memoize) {
      this.responseCache.set(key, structuredClone(value));
    }
    return value;
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

    const requestedIds = (Array.isArray(id) ? id : [id]).map(String);
    const normalizedOptions = normalizeThingOptions(options);
    const resolvedSignal = this.resolveSignal(signal);

    const itemsById = new Map<string, ThingInformation>();
    const missingIds: string[] = [];

    for (const thingId of requestedIds) {
      if (this.memoize) {
        const cached = this.thingCache.get(thingId, normalizedOptions);
        if (cached) {
          itemsById.set(thingId, cached);
          continue;
        }
      }
      if (!missingIds.includes(thingId)) {
        missingIds.push(thingId);
      }
    }

    const chunks: string[] = [];
    for (let i = 0; i < missingIds.length; i += 20) {
      chunks.push(missingIds.slice(i, i + 20).join(","));
    }

    const { ratings, ...restOptions } = options ?? {};
    let termsOfUse = TERMS_OF_USE;

    for (let i = 0; i < chunks.length; ++i) {
      const uri = generateURI(XMLAPI2, "thing", {
        id: chunks[i],
        ...restOptions,
        ...(ratings !== undefined ? { ratingcomments: ratings } : {}),
      });
      const response = await this.requestWithRetry<RawThingResponse>(
        uri,
        resolvedSignal,
      );
      const partial = ThingTransformer(response);
      if (partial.termsOfUse) termsOfUse = partial.termsOfUse;

      for (const item of partial.items) {
        const key = String(item.id);
        itemsById.set(key, item);
        if (this.memoize) {
          this.thingCache.set(key, normalizedOptions, item);
        }
      }

      this.progressEmitter.dispatchEvent(
        new CustomEvent("progress", {
          detail: partial.items,
        }),
      );
      this.progressEmitter.dispatchEvent(
        new CustomEvent("percent", {
          detail: chunks.length === 0 ? 1 : (i + 1) / chunks.length,
        }),
      );
      if (i < chunks.length - 1) {
        await pause(CHUNK_DELAY, resolvedSignal);
      }
    }

    if (chunks.length === 0) {
      this.progressEmitter.dispatchEvent(
        new CustomEvent("percent", { detail: 1 }),
      );
    }

    // Preserve first-seen request order (and drop duplicate ids).
    const seen = new Set<string>();
    const ordered: ThingInformation[] = [];
    for (const thingId of requestedIds) {
      if (seen.has(thingId)) continue;
      seen.add(thingId);
      const item = itemsById.get(thingId);
      if (item) ordered.push(item);
    }

    return {
      termsOfUse,
      items: ordered,
    };
  }

  async collection(
    username: string,
    options?: Partial<CollectionOptions>,
    signal?: AbortSignal,
  ): Promise<CollectionResponse> {
    const cacheKey = `collection:${stableSerialize({ username, options })}`;
    const cached = this.getCachedResponse<CollectionResponse>(cacheKey);
    if (cached) return cached;

    const uri = generateURI(XMLAPI2, "collection", {
      username,
      ...options,
    });
    const response = await this.requestWithRetry<RawCollectionResponse>(
      uri,
      signal,
    );
    return this.setCachedResponse(cacheKey, CollectionTransformer(response));
  }

  async collectionComplete(
    username: string,
    options?: Partial<CollectionOptions>,
    signal?: AbortSignal,
  ): Promise<CompleteDataCollectionResponse> {
    const cacheKey = `collectionComplete:${stableSerialize({
      username,
      options,
    })}`;
    const cached =
      this.getCachedResponse<CompleteDataCollectionResponse>(cacheKey);
    if (cached) return cached;

    const collection = await this.collection(
      username,
      { ...options, stats: true },
      signal,
    );

    if (collection.items.length === 0) {
      return this.setCachedResponse(cacheKey, {
        termsOfUse: collection.termsOfUse,
        retrievalDate: collection.retrievalDate,
        items: [],
      });
    }

    const things = await this.thing(
      collection.items.map((item) => item.id),
      { stats: true },
      signal,
    );
    const thingsById = new Map(things.items.map((item) => [item.id, item]));

    return this.setCachedResponse(cacheKey, {
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
    });
  }

  async user(username: string, signal?: AbortSignal): Promise<UserResponse> {
    const cacheKey = `user:${username}`;
    const cached = this.getCachedResponse<UserResponse>(cacheKey);
    if (cached) return cached;

    const uri = generateURI(XMLAPI2, "user", { name: username });
    const response = await this.requestWithRetry<RawUserResponse>(uri, signal);
    return this.setCachedResponse(cacheKey, UserTransformer(response));
  }

  async search(
    query: string,
    options?: Partial<SearchOptions>,
    signal?: AbortSignal,
  ): Promise<SearchResponse> {
    const cacheKey = `search:${stableSerialize({ query, options })}`;
    const cached = this.getCachedResponse<SearchResponse>(cacheKey);
    if (cached) return cached;

    const uri = generateURI(XMLAPI2, "search", { query, ...options });
    const response = await this.requestWithRetry<RawSearchResponse>(
      uri,
      signal,
    );
    return this.setCachedResponse(cacheKey, SearchTransformer(response));
  }

  async geeklist(
    id: string | number,
    signal?: AbortSignal,
  ): Promise<GeeklistResponse> {
    const cacheKey = `geeklist:${id}`;
    const cached = this.getCachedResponse<GeeklistResponse>(cacheKey);
    if (cached) return cached;

    const uri = generateURI(XMLAPI, `geeklist/${id}`);
    const response = await this.requestWithRetry<RawGeeklistResponse>(
      uri,
      signal,
    );
    return this.setCachedResponse(cacheKey, GeeklistTransformer(response));
  }

  async image(id: string | number, signal?: AbortSignal): Promise<string> {
    const cacheKey = `image:${id}`;
    const cached = this.getCachedResponse<string>(cacheKey);
    if (cached) return cached;

    const uri = generateURI(GEEKDO_API, `images/${id}`);
    const response = await this.requestWithRetry<RawGeekdoImageResponse>(
      uri,
      signal,
      (u, s) => this.fetchJsonFromGeekdo(u, s),
    );
    const url = response.images?.original?.url;
    if (!url) {
      throw new BggError(`Missing original image URL for image ${id}.`, {
        status: 0,
      });
    }
    return this.setCachedResponse(cacheKey, url);
  }
}

const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === "AbortError";
};

const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError;
};

export default BGG;
