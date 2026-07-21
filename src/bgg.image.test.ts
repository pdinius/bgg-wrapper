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

const imageJson = {
  images: {
    original: { url: ORIGINAL_URL },
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

  it("returns images.original.url", async () => {
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

  it("memoizes the URL string", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(jsonResponse(200, imageJson));

    const bgg = new BGG({ authToken: "token", memoize: true });
    const first = await bgg.image("9678597");
    const second = await bgg.image("9678597");

    expect(first).toBe(ORIGINAL_URL);
    expect(second).toBe(ORIGINAL_URL);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws when original.url is missing", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { images: {} }));

    const bgg = new BGG({ authToken: "token" });
    await expect(bgg.image(1)).rejects.toBeInstanceOf(BggError);
  });
});
