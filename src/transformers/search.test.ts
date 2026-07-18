import { describe, expect, it } from "vitest";
import { SearchTransformer } from "./search";
import { RawSearchResponse } from "../types/search";

describe("SearchTransformer", () => {
  it("maps a single valid item", () => {
    const raw: RawSearchResponse = {
      items: {
        $: { total: 1, termsofuse: "https://boardgamegeek.com/xmlapi/termsofuse" },
        item: {
          $: { type: "boardgame", id: 9209 },
          name: { type: "primary", value: "Ticket to Ride" },
          yearpublished: { value: 2004 },
        },
      },
    };

    expect(SearchTransformer(raw)).toEqual({
      termsOfUse: "https://boardgamegeek.com/xmlapi/termsofuse",
      total: 1,
      items: [
        {
          id: 9209,
          type: "boardgame",
          name: "Ticket to Ride",
          yearPublished: 2004,
        },
      ],
    });
  });

  it("filters unknown thing types from arrays and singles", () => {
    const raw: RawSearchResponse = {
      items: {
        $: { total: 2, termsofuse: "tou" },
        item: [
          {
            $: { type: "boardgame", id: 1 },
            name: { type: "primary", value: "Keep" },
            yearpublished: { value: 2000 },
          },
          {
            $: { type: "videogame" as "boardgame", id: 2 },
            name: { type: "primary", value: "Drop" },
            yearpublished: { value: 2001 },
          },
        ],
      },
    };

    expect(SearchTransformer(raw).items).toEqual([
      { id: 1, type: "boardgame", name: "Keep", yearPublished: 2000 },
    ]);
  });

  it("returns an empty list when no items are present", () => {
    const raw: RawSearchResponse = {
      items: {
        $: { total: 0, termsofuse: "tou" },
      },
    };

    expect(SearchTransformer(raw).items).toEqual([]);
  });
});
