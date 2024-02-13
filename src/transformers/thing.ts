import { log } from "../helpers";
import { ThingRawResponse, ThingResponse } from "../types/thing";

export const thingTransformer = (raw: ThingRawResponse): ThingResponse => {
  log(raw);
  return {};
}