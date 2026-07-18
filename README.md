# BGG Wrapper

TypeScript wrapper for the [BoardGameGeek XML API2](https://boardgamegeek.com/wiki/page/BGG_XML_API2). It converts XML responses to typed JSON, chunks large `thing` requests, and automatically retries BGG's `202` (queued) and `429` (rate limit) responses.

## Installation

```bash
npm i bgg-wrapper
```

## Usage

You must pass a valid BGG auth token. Other constructor options are optional.

```ts
import BGG, { BggError } from "bgg-wrapper";
// or: import { BGG } from "bgg-wrapper";

const bgg = new BGG({
  authToken: "00000000-0000-0000-0000-000000000000",
});

const ticketToRide = await bgg.thing("9209");
console.log(ticketToRide.items[0].name); // Ticket to Ride
```

### Methods

| Method | Description |
| --- | --- |
| `thing(id, options?, signal?)` | Fetch one or more things (IDs are chunked by 20) |
| `collection(username, options?, signal?)` | Fetch a user's collection (handles 202 polling) |
| `collectionComplete(username, options?, signal?)` | Collection plus merged `thing` stats/links |
| `user(username, signal?)` | Fetch a user profile |
| `search(query, options?, signal?)` | Search for things by name |

### Progress listeners

For large `thing` requests you can track chunk progress:

```ts
const bgg = new BGG({
  authToken: process.env.BGG_AUTH_TOKEN!,
  progressListener: (items) => {
    // items from the most recent chunk
  },
  percentListener: (percent) => {
    // 0–1 progress across chunks
  },
});
```

### AbortSignal

Pass a signal on the constructor (applies to all calls) and/or per method:

```ts
const controller = new AbortController();
const bgg = new BGG({ authToken: "...", signal: controller.signal });

await bgg.collection("username", { own: true }, controller.signal);
```

### Errors

Failed requests throw `BggError` (`status`, `details`, `retriable`). Retries are capped and only applied to `202`, `429`, and network failures.

```ts
import { BGG, BggError } from "bgg-wrapper";

try {
  await bgg.collection("username");
} catch (error) {
  if (error instanceof BggError) {
    console.error(error.status, error.details);
  }
}
```

### Types

Public response and options types are exported from the package root, including `ThingOptions`, `CollectionOptions`, `SearchOptions`, `ThingResponse`, `CollectionResponse`, `UserResponse`, and `SearchResponse`.
