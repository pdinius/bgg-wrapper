import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BGG, BggError } from "./index";

vi.mock("./shared/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./shared/utils")>();
  return {
    ...actual,
    pause: vi.fn().mockResolvedValue(undefined),
  };
});

const ORIGINAL_URL =
  "https://cf.geekdo-images.com/example__original/img/abc=/0x0/filters:format(png)/pic9678597.png";
const MEDIUM_URL =
  "https://cf.geekdo-images.com/example__medium/img/def=/fit-in/500x500/filters:strip_icc()/pic9678597.png";

const imageJson = {
  images: {
    original: { url: ORIGINAL_URL },
    medium: { url: MEDIUM_URL },
  },
};

const jsonResponse = (status: number, body?: object) =>
  new Response(body === undefined ? "" : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("BGG.image", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("returns images.original.url by default", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(jsonResponse(200, imageJson));

    const bgg = new BGG({ authToken: "token" });
    const url = await bgg.image(9678597);

    expect(url).toBe(ORIGINAL_URL);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.geekdo.com/api/images/9678597",
      expect.objectContaining({
        headers: { Authorization: "Bearer token" },
      }),
    );
  });

  it("returns the requested size URL", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(jsonResponse(200, imageJson));

    const bgg = new BGG({ authToken: "token" });
    const url = await bgg.image(9678597, { size: "medium" });

    expect(url).toBe(MEDIUM_URL);
  });

  it("memoizes separately per size", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, imageJson))
      .mockResolvedValueOnce(jsonResponse(200, imageJson));

    const bgg = new BGG({ authToken: "token", memoize: true });
    const original = await bgg.image("9678597");
    const medium = await bgg.image("9678597", { size: "medium" });
    const originalAgain = await bgg.image("9678597");

    expect(original).toBe(ORIGINAL_URL);
    expect(medium).toBe(MEDIUM_URL);
    expect(originalAgain).toBe(ORIGINAL_URL);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws when the requested size URL is missing", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, { images: {} }))
      .mockResolvedValueOnce(jsonResponse(200, { images: {} }));

    const bgg = new BGG({ authToken: "token" });
    await expect(bgg.image(1)).rejects.toBeInstanceOf(BggError);
    await expect(bgg.image(1, { size: "square" })).rejects.toBeInstanceOf(
      BggError,
    );
  });
});
