import { NameType, ThingType } from "./general";

//#region Options
export type SearchOptions = {
  type?: ThingType | "boardgamedesigner";
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
