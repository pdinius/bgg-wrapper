import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./shared/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./shared/utils")>();
  return {
    ...actual,
    pause: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock("./transformers/thing", () => ({
  ThingTransformer: (raw: {
    items: {
      $: { termsofuse: string };
      item:
        | { $: { id: number }; name: string }
        | Array<{ $: { id: number }; name: string }>;
    };
  }) => {
    const items = Array.isArray(raw.items.item)
      ? raw.items.item
      : [raw.items.item];
    return {
      termsOfUse: raw.items.$.termsofuse,
      items: items.map((item) => ({
        id: item.$.id,
        name: item.name,
      })),
    };
  },
}));

import { BGG } from "./index";

const thingXml = (games: { id: number; name: string }[]) => {
  const items = games
    .map(
      (g) =>
        `<item type="boardgame" id="${g.id}"><name type="primary" value="${g.name}"/></item>`,
    )
    .join("");
  return `<?xml version="1.0"?><items termsofuse="tou">${items}</items>`;
};

describe("BGG thing memoization", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("does not memoize when memoize is false", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation(
      async () =>
        new Response(thingXml([{ id: 9209, name: "Ticket to Ride" }]), {
          status: 200,
        }),
    );

    const bgg = new BGG({ authToken: "token" });
    await bgg.thing(9209);
    await bgg.thing(9209);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("reuses cached things and only fetches missing ids", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        new Response(
          thingXml([
            { id: 1, name: "One" },
            { id: 2, name: "Two" },
          ]),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(thingXml([{ id: 3, name: "Three" }]), { status: 200 }),
      );

    const bgg = new BGG({ authToken: "token", memoize: true });
    const first = await bgg.thing([1, 2], { stats: true });
    expect(first.items.map((i) => i.id)).toEqual([1, 2]);

    const second = await bgg.thing([2, 3, 1]);
    expect(second.items.map((i) => i.id)).toEqual([2, 3, 1]);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const lastUrl = String(fetchMock.mock.calls[1]?.[0]);
    expect(lastUrl).toContain("id=3");
    expect(lastUrl).not.toMatch(/id=3,|id=2|,2/);
  });

  it("serves stats:false from a stats:true cache entry", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation(
      async () =>
        new Response(thingXml([{ id: 9209, name: "Ticket to Ride" }]), {
          status: 200,
        }),
    );

    const bgg = new BGG({ authToken: "token", memoize: true });
    await bgg.thing(9209, { stats: true });
    await bgg.thing(9209);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("refetches when a richer option set is required", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation(
      async () =>
        new Response(thingXml([{ id: 9209, name: "Ticket to Ride" }]), {
          status: 200,
        }),
    );

    const bgg = new BGG({ authToken: "token", memoize: true });
    await bgg.thing(9209);
    await bgg.thing(9209, { stats: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
