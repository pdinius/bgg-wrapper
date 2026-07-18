import { describe, expect, it, vi } from "vitest";
import { decodeEntities, generateURI, pause } from "./utils";

describe("generateURI", () => {
  it("builds a route with no params", () => {
    expect(generateURI("https://example.com/", "thing")).toBe(
      "https://example.com/thing",
    );
  });

  it("encodes string params and maps booleans to 0/1", () => {
    expect(
      generateURI("https://example.com/", "search", {
        query: "ticket & ride",
        exact: true,
        stats: false,
        page: 2,
        unused: undefined,
      }),
    ).toBe(
      "https://example.com/search?query=ticket%20%26%20ride&exact=1&stats=0&page=2",
    );
  });
});

describe("pause", () => {
  it("resolves after the delay", async () => {
    vi.useFakeTimers();
    const pending = pause(1);
    await vi.advanceTimersByTimeAsync(1000);
    await expect(pending).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it("rejects when the signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(pause(1, controller.signal)).rejects.toMatchObject({
      name: "AbortError",
    });
  });

  it("rejects when aborted during the wait", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const pending = pause(5, controller.signal);
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
    vi.useRealTimers();
  });
});

describe("decodeEntities", () => {
  it("decodes common HTML entities", () => {
    expect(decodeEntities("A &amp; B &#34;C&#34;")).toBe('A & B "C"');
  });
});
