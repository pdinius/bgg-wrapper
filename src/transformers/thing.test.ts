import { describe, expect, it } from "vitest";
import { versionMapper } from "./thing";
import { RawVersion } from "../types/thing";

describe("versionMapper", () => {
  it("maps publishers, artists, languages, canonical name, and parent game", () => {
    const raw: RawVersion = {
      $: { type: "boardgameversion", id: 624648 },
      thumbnail: "https://example.com/thumb.jpg",
      image: "https://example.com/image.jpg",
      canonicalname: { value: "Puerto Rico 1897" },
      name: { type: "primary", sortIndex: 1, value: "English/French edition" },
      yearpublished: { value: 2023 },
      productcode: { value: "" },
      width: { value: 8.9 },
      length: { value: 12.4 },
      depth: { value: 2.2 },
      weight: { value: 0 },
      link: [
        {
          type: "boardgameversion",
          id: 367272,
          value: "Puerto Rico 1897",
          inbound: "true",
        },
        { type: "boardgamepublisher", id: 9, value: "alea" },
        { type: "boardgameartist", id: 24122, value: "John Morrow" },
        { type: "boardgameartist", id: 114351, value: "Gabriel Ramos" },
        { type: "language", id: 2184, value: "English" },
        { type: "language", id: 2187, value: "French" },
      ],
    };

    expect(versionMapper(raw)).toEqual({
      id: 624648,
      name: "English/French edition",
      canonicalName: "Puerto Rico 1897",
      thumbnail: "https://example.com/thumb.jpg",
      image: "https://example.com/image.jpg",
      productCode: undefined,
      yearPublished: 2023,
      width: 8.9,
      length: 12.4,
      depth: 2.2,
      weight: 0,
      game: { id: 367272, value: "Puerto Rico 1897" },
      publishers: [{ id: 9, value: "alea" }],
      artists: [
        { id: 24122, value: "John Morrow" },
        { id: 114351, value: "Gabriel Ramos" },
      ],
      languages: [
        { id: 2184, value: "English" },
        { id: 2187, value: "French" },
      ],
    });
  });

  it("handles versions with no artists and a product code", () => {
    const raw: RawVersion = {
      $: { type: "boardgameversion", id: 745699 },
      thumbnail: "t",
      image: "i",
      canonicalname: { value: "Puerto Rico 1897" },
      name: { type: "primary", sortIndex: 1, value: "Ukrainian edition" },
      yearpublished: { value: 2025 },
      productcode: { value: "LBG00007" },
      width: { value: 1 },
      length: { value: 2 },
      depth: { value: 3 },
      weight: { value: 0 },
      link: [
        {
          type: "boardgameversion",
          id: 367272,
          value: "Puerto Rico 1897",
          inbound: "true",
        },
        { type: "boardgamepublisher", id: 9, value: "alea" },
        { type: "boardgamepublisher", id: 49985, value: "Lelekan" },
        { type: "language", id: 2665, value: "Ukrainian" },
      ],
    };

    const result = versionMapper(raw);
    expect(result.productCode).toBe("LBG00007");
    expect(result.artists).toEqual([]);
    expect(result.publishers).toEqual([
      { id: 9, value: "alea" },
      { id: 49985, value: "Lelekan" },
    ]);
    expect(result.languages).toEqual([{ id: 2665, value: "Ukrainian" }]);
  });
});
