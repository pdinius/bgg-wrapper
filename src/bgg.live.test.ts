import { describe, expect, it } from "vitest";
import { BGG } from "./index";
import { loadEnvFile } from "./live.setup";

loadEnvFile();

const authToken =
  process.env.BGG_AUTH_TOKEN ?? process.env.AUTH_TOKEN ?? "";

const liveEnabled = Boolean(authToken);

describe.skipIf(!liveEnabled)("BGG live API", () => {
  const bgg = new BGG({ authToken });

  it("fetches a known thing", async () => {
    const result = await bgg.thing(9209, { stats: true });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0]?.name).toMatch(/Ticket to Ride/i);
    expect(result.items[0]?.id).toBe(9209);
  });

  it("searches by name", async () => {
    const result = await bgg.search("Ticket to Ride", { exact: false });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.some((item) => item.id === 9209)).toBe(true);
  });

  it("fetches a user profile", async () => {
    const result = await bgg.user("boardgamegeek");
    expect(result.username.toLowerCase()).toBe("boardgamegeek");
    expect(result.id).toBeGreaterThan(0);
  });

  it("fetches a collection (may poll on 202)", async () => {
    // Use a smaller public collection to keep the live suite fast.
    const result = await bgg.collection("Aldie", {
      own: true,
      excludesubtype: "boardgameexpansion",
    });
    expect(result.retrievalDate).toBeInstanceOf(Date);
    expect(Array.isArray(result.items)).toBe(true);
  });
});
