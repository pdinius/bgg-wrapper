import { isThingType } from "../types/general";
import {
  RawSearchItem,
  RawSearchResponse,
  SearchResponse,
  SearchResult,
} from "../types/search";

const searchItemTransformer = (raw: RawSearchItem): SearchResult => {
  return {
    id: raw.$.id,
    type: raw.$.type,
    name: raw.name.value,
    yearPublished: raw.yearpublished.value,
  };
};

export const searchTransformer = (raw: RawSearchResponse): SearchResponse => {
  const searchResults = raw.items.item;

  let items: SearchResult[] = [];

  if (searchResults !== undefined) {
    if (Array.isArray(searchResults)) {
      for (const result of searchResults) {
        if (!isThingType(result.$.type)) continue;
        items.push(searchItemTransformer(result));
      }
    } else {
      items = [searchItemTransformer(searchResults)];
    }
  }

  return {
    termsOfUse: raw.items.$.termsofuse,
    total: raw.items.$.total,
    items,
  };
};
