# BGG Wrapper
This is the repository for the npm package `bgg-wrapper`. The purpose of this package is to wrap [board game geek's api](https://boardgamegeek.com/wiki/page/BGG_XML_API2) in order to improve the developer experience. The benefits of this wrapper:

- It converts the XML format to JSON for usability.
- It handles retry logic for things like fetching collections when you have to make multiple calls.
- It utilizes typescript to provide typing for both parameters and return values.

## Installation
`npm i bgg-wrapper` or `yarn add bgg-wrapper`

## Usage
Here is a minimal example.

> Note: you must to pass a valid bgg auth token. Other parameters are optional.

```
import bggApi from "bgg-wrapper";

const bgg = new bggApi({ authToken: "00000000-0000-0000-0000-000000000000" });

const foo = async () => {
  const ticketToRideData = await bgg.thing("9209");
  
  console.log(ticketToRideData.items[0].name); // Ticket to Ride
}

foo();
```
