import { NameType, ThingType } from "./general";

export type SearchOptions = {
  type?: ThingType;
  exact?: boolean;
};

export type SearchResultRaw = {
  $: {
    type: ThingType;
    id: number;
  };
  name: {
    type: NameType;
    value: string;
  };
  yearpublished?: {
    value: number;
  };
};

export type SearchRawResponse = {
  items: {
    $: {
      total: number;
      termsofuse: string;
    };
    item: Array<SearchResultRaw> | SearchResultRaw;
  };
};

export type SearchResult = {
  type: ThingType;
  id: string;
  name: string;
  nameType: NameType;
  yearPublished?: number;
};

export type SearchResponse = {
  numItems: number;
  items: Array<SearchResult>;
  termsofuse: string;
};
