import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BGG, BggError } from "./index";
import { MAX_RETRIES } from "./shared/constants";

vi.mock("./shared/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./shared/utils")>();
  return {
    ...actual,
    pause: vi.fn().mockResolvedValue(undefined),
  };
});

const USER_XML = `<?xml version="1.0" encoding="utf-8"?>
<user id="42" name="tester" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
  <firstname value="Test" />
  <lastname value="User" />
</user>`;

const jsonResponse = (status: number, body = "") =>
  new Response(body, {
    status,
    headers: { "Content-Type": "text/xml" },
  });

describe("BGG request retries", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("retries after 202 and returns data on 200", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(202))
      .mockResolvedValueOnce(jsonResponse(200, USER_XML));

    const bgg = new BGG({ authToken: "token" });
    const user = await bgg.user("tester");

    expect(user.username).toBe("tester");
    expect(user.id).toBe(42);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry permanent 4xx errors", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(jsonResponse(400, "bad request"));

    const bgg = new BGG({ authToken: "token" });
    await expect(bgg.user("tester")).rejects.toBeInstanceOf(BggError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("stops after MAX_RETRIES retriable failures", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(jsonResponse(202));

    const bgg = new BGG({ authToken: "token" });
    await expect(bgg.user("tester")).rejects.toMatchObject({
      status: 202,
      retriable: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(MAX_RETRIES + 1);
  });

  it("propagates abort errors without retrying", async () => {
    const controller = new AbortController();
    controller.abort();

    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation(() => {
      const error = new Error("This operation was aborted");
      error.name = "AbortError";
      return Promise.reject(error);
    });

    const bgg = new BGG({ authToken: "token", signal: controller.signal });
    await expect(bgg.user("tester")).rejects.toMatchObject({
      name: "AbortError",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
