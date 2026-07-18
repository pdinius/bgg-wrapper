import { ThingInformation, ThingOptions } from "../types/thing";

export type NormalizedThingOptions = {
  stats: boolean;
  versions: boolean;
  videos: boolean;
  marketplace: boolean;
  comments: boolean;
  ratings: boolean;
  /** Only meaningful when comments or ratings is true. */
  page: number;
};

export type ThingCacheEntry = {
  options: NormalizedThingOptions;
  item: ThingInformation;
};

export const normalizeThingOptions = (
  options?: Partial<ThingOptions>,
): NormalizedThingOptions => ({
  stats: Boolean(options?.stats),
  versions: Boolean(options?.versions),
  videos: Boolean(options?.videos),
  marketplace: Boolean(options?.marketplace),
  comments: Boolean(options?.comments),
  ratings: Boolean(options?.ratings),
  page: options?.page ?? 1,
});

/** True when `cached` includes at least everything `requested` asked for. */
export const thingOptionsCover = (
  cached: NormalizedThingOptions,
  requested: NormalizedThingOptions,
): boolean => {
  if (requested.stats && !cached.stats) return false;
  if (requested.versions && !cached.versions) return false;
  if (requested.videos && !cached.videos) return false;
  if (requested.marketplace && !cached.marketplace) return false;
  if (requested.comments && !cached.comments) return false;
  if (requested.ratings && !cached.ratings) return false;

  if (
    (requested.comments || requested.ratings) &&
    cached.page !== requested.page
  ) {
    return false;
  }

  return true;
};

export const normalizeThingId = (id: string | number): string => String(id);

/**
 * In-memory per-thing cache. Entries are stored by id; a cached response can
 * satisfy a later request when its options are a superset of the new request.
 */
export class ThingMemoCache {
  private readonly entries = new Map<string, ThingCacheEntry[]>();

  get(
    id: string | number,
    requested: NormalizedThingOptions,
  ): ThingInformation | undefined {
    const list = this.entries.get(normalizeThingId(id));
    if (!list) return undefined;

    const hit = list.find((entry) =>
      thingOptionsCover(entry.options, requested),
    );
    return hit ? structuredClone(hit.item) : undefined;
  }

  set(
    id: string | number,
    options: NormalizedThingOptions,
    item: ThingInformation,
  ): void {
    const key = normalizeThingId(id);
    const existing = this.entries.get(key) ?? [];

    // Drop entries that are strict subsets of the new options (covered by it).
    const remaining = existing.filter(
      (entry) => !thingOptionsCover(options, entry.options),
    );

    // Avoid duplicate equivalent option sets.
    const withoutSame = remaining.filter(
      (entry) => !thingOptionsEqual(entry.options, options),
    );

    withoutSame.push({
      options: { ...options },
      item: structuredClone(item),
    });

    this.entries.set(key, withoutSame);
  }

  clear(): void {
    this.entries.clear();
  }
}

const thingOptionsEqual = (
  a: NormalizedThingOptions,
  b: NormalizedThingOptions,
): boolean => {
  return (
    a.stats === b.stats &&
    a.versions === b.versions &&
    a.videos === b.videos &&
    a.marketplace === b.marketplace &&
    a.comments === b.comments &&
    a.ratings === b.ratings &&
    a.page === b.page
  );
};

export const stableSerialize = (value: unknown): string => {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(",")}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .filter((k) => obj[k] !== undefined)
    .map((k) => `${JSON.stringify(k)}:${stableSerialize(obj[k])}`)
    .join(",")}}`;
};
