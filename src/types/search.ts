import { ThingType } from "./general";

export type SearchOptions = {
  type: Exclude<ThingType, "boardgameversion">;
  exact: boolean;
};

export type RawSearchItem = {
  $: {
    type: ThingType;
    id: number;
  };
  name: {
    type: "primary" | "alternate";
    value: string;
  };
  yearpublished: {
    value: number;
  };
};

export type RawSearchResponse = {
  items: {
    $: {
      total: number;
      termsofuse: string;
    };
    item?: RawSearchItem | RawSearchItem[];
  };
};

export type SearchResult = {
  id: number;
  type: ThingType;
  name: string;
  yearPublished: number;
};

export type SearchResponse = {
  termsOfUse: string;
  total: number;
  items: SearchResult[];
};
