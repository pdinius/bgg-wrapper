import { invariantArray } from "../shared/utils";
import { isThingType } from "../types/general";
import {
  RawSearchItem,
  RawSearchResponse,
  SearchResponse,
  SearchResult,
} from "../types/search";

const SearchItemTransformer = (raw: RawSearchItem): SearchResult => {
  return {
    id: raw.$.id,
    type: raw.$.type,
    name: raw.name.value,
    yearPublished: raw.yearpublished.value,
  };
};

export const SearchTransformer = (raw: RawSearchResponse): SearchResponse => {
  const searchResults = raw.items.item;
  const items: SearchResult[] = [];

  if (searchResults !== undefined) {
    for (const result of invariantArray(searchResults)) {
      if (!isThingType(result.$.type)) continue;
      items.push(SearchItemTransformer(result));
    }
  }

  return {
    termsOfUse: raw.items.$.termsofuse,
    total: raw.items.$.total,
    items,
  };
};
