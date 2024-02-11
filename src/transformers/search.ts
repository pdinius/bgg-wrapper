import {
  SearchRawResponse,
  SearchResponse,
  SearchResult,
  SearchResultRaw,
} from "../types/search";

const searchResultTransformer = (raw: SearchResultRaw): SearchResult => {
  return {
    type: raw.$?.type,
    id: String(raw.$?.id),
    name: raw.name?.value,
    nameType: raw.name?.type,
    yearPublished: raw.yearpublished?.value,
  };
};

export const searchTransformer = (raw: SearchRawResponse): SearchResponse => {
  let items: Array<SearchResult> = [];

  if (Array.isArray(raw.items?.item)) {
    items = raw.items?.item?.map(searchResultTransformer);
  } else {
    items = [searchResultTransformer(raw.items?.item)];
  }

  return {
    numItems: raw.items?.$?.total,
    items,
    termsofuse: raw.items?.$?.termsofuse,
  };
};
