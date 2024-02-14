import { log } from "../helpers";
import { Thing, ThingRaw, ThingRawResponse, ThingResponse } from "../types/thing";

const singleThingTransformer = (raw: ThingRaw): Thing => {
  return {};
}

export const thingTransformer = (raw: ThingRawResponse): ThingResponse => {
  const { items: { $, item } } = raw;

  let items: Array<Thing> = [];
  if (Array.isArray(item)) {
    items = item.map(singleThingTransformer);
  } else {
    items = [singleThingTransformer(item)];
  }

  return {
    items,
    termsofuse: $?.termsofuse
  };
}