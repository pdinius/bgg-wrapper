import { describe, expect, it } from "vitest";
import { CollectionTransformer } from "./collection";
import { RawCollectionResponse } from "../types/collection";

describe("CollectionTransformer", () => {
  it("maps collection items and uses null for missing values", () => {
    const raw: RawCollectionResponse = {
      items: {
        $: {
          totalitems: 1,
          termsofuse: "https://boardgamegeek.com/xmlapi/termsofuse",
          pubdate: "Tue, 01 Jan 2024 00:00:00 +0000",
        },
        item: {
          $: {
            objecttype: "thing",
            objectid: 9209,
            subtype: "boardgame",
            collid: 1,
          },
          name: { $: { sortindex: 1 }, _content: "Ticket to Ride" },
          image: "https://example.com/image.jpg",
          thumbnail: "https://example.com/thumb.jpg",
          status: {
            own: 1,
            prevowned: 0,
            fortrade: 0,
            want: 0,
            wanttoplay: 0,
            wanttobuy: 0,
            wishlist: 0,
            wishlistpriority: 0,
            preordered: 0,
            lastmodified: "2024-01-01 00:00:00",
          },
          stats: {
            $: {
              playingtime: 60,
              numowned: 100,
            },
            rating: {
              $: { value: "N/A" },
              usersrated: { value: 10 },
              average: { value: 7.5 },
              bayesaverage: { value: 7.1 },
              stddev: { value: 1 },
              median: { value: 7 },
              ranks: {
                rank: {
                  type: "subtype",
                  id: 1,
                  name: "boardgame",
                  friendlyname: "Board Game Rank",
                  value: "Not Ranked",
                  bayesaverage: 0,
                },
              },
            },
          },
        },
      },
    };

    const result = CollectionTransformer(raw);

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: 9209,
      name: "Ticket to Ride",
      yearPublished: null,
      status: {
        own: true,
        wishlist: false,
        wishlistPriority: null,
      },
      statistics: {
        minPlayers: null,
        maxPlayers: null,
        rating: null,
        ranks: [
          {
            id: 1,
            category: "boardgame",
            label: "Board Game Rank",
            rank: null,
          },
        ],
      },
    });
  });
});
