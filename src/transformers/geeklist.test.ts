import { describe, expect, it } from "vitest";
import { GeeklistTransformer } from "./geeklist";
import { RawGeeklistResponse } from "../types/geeklist";

describe("GeeklistTransformer", () => {
  it("maps geeklist metadata and a single item", () => {
    const raw: RawGeeklistResponse = {
      geeklist: {
        $: {
          id: 11205,
          termsofuse: "https://boardgamegeek.com/xmlapi/termsofuse",
        },
        postdate: "Sat, 18 Nov 2006 20:12:46 +0000",
        postdate_timestamp: 1163880766,
        editdate: "Tue, 03 Nov 2009 17:11:22 +0000",
        editdate_timestamp: 1257268282,
        thumbs: 94,
        numitems: 1,
        username: "zefquaavius",
        title: "Segregation in Carcassonne!",
        description: "You've mixed all your Carcassonne expansions.",
        item: {
          $: {
            id: 186612,
            objecttype: "thing",
            subtype: "boardgame",
            objectid: 822,
            objectname: "Carcassonne",
            username: "zefquaavius",
            postdate: "Thu, 10 Nov 2005 02:46:36 +0000",
            editdate: "Mon, 05 Nov 2007 19:57:31 +0000",
            thumbs: 2,
            imageid: 100654,
          },
          body: "2000 [b]Carcassonne[/b] 72 land tiles",
        },
      },
    };

    expect(GeeklistTransformer(raw)).toEqual({
      termsOfUse: "https://boardgamegeek.com/xmlapi/termsofuse",
      id: 11205,
      postDate: new Date("Sat, 18 Nov 2006 20:12:46 +0000"),
      editDate: new Date("Tue, 03 Nov 2009 17:11:22 +0000"),
      thumbs: 94,
      numItems: 1,
      username: "zefquaavius",
      title: "Segregation in Carcassonne!",
      description: "You've mixed all your Carcassonne expansions.",
      items: [
        {
          id: 186612,
          objectType: "thing",
          type: "boardgame",
          objectId: 822,
          name: "Carcassonne",
          username: "zefquaavius",
          postDate: new Date("Thu, 10 Nov 2005 02:46:36 +0000"),
          editDate: new Date("Mon, 05 Nov 2007 19:57:31 +0000"),
          thumbs: 2,
          imageId: 100654,
          body: "2000 [b]Carcassonne[/b] 72 land tiles",
        },
      ],
    });
  });

  it("maps an array of items", () => {
    const raw: RawGeeklistResponse = {
      geeklist: {
        $: { id: 1, termsofuse: "tou" },
        postdate: "Sat, 18 Nov 2006 20:12:46 +0000",
        postdate_timestamp: 0,
        editdate: "Sat, 18 Nov 2006 20:12:46 +0000",
        editdate_timestamp: 0,
        thumbs: 0,
        numitems: 2,
        username: "user",
        title: "List",
        description: "Desc",
        item: [
          {
            $: {
              id: 10,
              objecttype: "thing",
              subtype: "boardgame",
              objectid: 100,
              objectname: "Game A",
              username: "user",
              postdate: "Sat, 18 Nov 2006 20:12:46 +0000",
              editdate: "Sat, 18 Nov 2006 20:12:46 +0000",
              thumbs: 0,
              imageid: 1,
            },
            body: "A",
          },
          {
            $: {
              id: 11,
              objecttype: "thing",
              subtype: "boardgameexpansion",
              objectid: 101,
              objectname: "Game B &amp; Co",
              username: "user",
              postdate: "Sat, 18 Nov 2006 20:12:46 +0000",
              editdate: "Sat, 18 Nov 2006 20:12:46 +0000",
              thumbs: 1,
              imageid: 2,
            },
            body: "B",
          },
        ],
      },
    };

    const result = GeeklistTransformer(raw);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].objectId).toBe(100);
    expect(result.items[1]).toMatchObject({
      type: "boardgameexpansion",
      name: "Game B & Co",
      objectId: 101,
    });
  });

  it("returns an empty list when no items are present", () => {
    const raw: RawGeeklistResponse = {
      geeklist: {
        $: { id: 1, termsofuse: "tou" },
        postdate: "Sat, 18 Nov 2006 20:12:46 +0000",
        postdate_timestamp: 0,
        editdate: "Sat, 18 Nov 2006 20:12:46 +0000",
        editdate_timestamp: 0,
        thumbs: 0,
        numitems: 0,
        username: "user",
        title: "Empty",
        description: "Nothing here",
      },
    };

    expect(GeeklistTransformer(raw).items).toEqual([]);
  });
});
