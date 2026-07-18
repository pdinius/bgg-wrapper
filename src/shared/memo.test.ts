import { describe, expect, it } from "vitest";
import {
  normalizeThingOptions,
  ThingMemoCache,
  thingOptionsCover,
} from "./memo";
import { ThingInformation } from "../types/thing";

const stubThing = (id: number, name = `Game ${id}`): ThingInformation =>
  ({
    id,
    name,
  }) as ThingInformation;

describe("thingOptionsCover", () => {
  it("treats stats:true as a cover for stats:false", () => {
    const withStats = normalizeThingOptions({ stats: true });
    const withoutStats = normalizeThingOptions({});
    expect(thingOptionsCover(withStats, withoutStats)).toBe(true);
    expect(thingOptionsCover(withoutStats, withStats)).toBe(false);
  });

  it("requires matching page when comments are requested", () => {
    const page1 = normalizeThingOptions({ comments: true, page: 1 });
    const page2 = normalizeThingOptions({ comments: true, page: 2 });
    expect(thingOptionsCover(page1, page2)).toBe(false);
    expect(thingOptionsCover(page1, normalizeThingOptions({}))).toBe(true);
  });
});

describe("ThingMemoCache", () => {
  it("returns a clone and upgrades subset entries", () => {
    const cache = new ThingMemoCache();
    const options = normalizeThingOptions({ stats: true });
    cache.set(9209, options, stubThing(9209, "Ticket to Ride"));

    const hit = cache.get(9209, normalizeThingOptions({}));
    expect(hit?.name).toBe("Ticket to Ride");
    if (hit) hit.name = "mutated";
    expect(cache.get(9209, options)?.name).toBe("Ticket to Ride");
  });

  it("stores richer options and still serves leaner requests", () => {
    const cache = new ThingMemoCache();
    cache.set(1, normalizeThingOptions({}), stubThing(1, "Lean"));
    cache.set(
      1,
      normalizeThingOptions({ stats: true }),
      stubThing(1, "Rich"),
    );

    expect(cache.get(1, normalizeThingOptions({ stats: true }))?.name).toBe(
      "Rich",
    );
    expect(cache.get(1, normalizeThingOptions({}))?.name).toBe("Rich");
  });
});
