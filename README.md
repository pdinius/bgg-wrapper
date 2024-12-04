# BGG Wrapper
This is the repository for the npm package `bgg-wrapper`. The purpose of this package is to wrap [board game geek's api](https://boardgamegeek.com/wiki/page/BGG_XML_API2) in order to improve the developer experience. The benefits of this wrapper:

- It converts the XML format to JSON for usability.
- It handles retry logic for things like fetching collections when you have to make multiple calls.
- It utilizes typescript to provide typing for both endpoint parameters and thier returned JSON.

## Installation
`npm i bgg-wrapper` or `yarn add bgg-wrapper`

## Usage
```
import bggApi from "bgg-wrapper";

const bgg = new bggApi();

const foo = async () => {
  const ticketToRideData = await bgg.thing("9209");
  
  console.log(ticketToRideData.items[0].name); // Ticket to Ride
}

foo();
```
