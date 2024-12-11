import { OrArray } from "../lib/utils";
import { ThingType } from "../types/general";

//#region Options
export type CollectionOptions = Partial<{
  version: boolean;
  subtype: ThingType;
  excludesubtype: ThingType;
  id: string | Array<string>;
  brief: boolean;
  stats: boolean;
  own: boolean;
  rated: boolean;
  played: boolean;
  comment: boolean;
  trade: boolean;
  want: boolean;
  wishlist: boolean;
  wishlistpriority: number;
  preordered: boolean;
  wanttoplay: boolean;
  wanttobuy: boolean;
  prevowned: boolean;
  hasparts: boolean;
  wantparts: boolean;
  minrating: number;
  maxrating: number;
  minbggrating: number;
  maxbggrating: number;
  minplays: number;
  maxplays: number;
  showprivate: boolean;
  collid: string;
  modifiedsince: Date | string;
}>;

export type CollectionOptionsClean = Partial<
  CollectionOptions & {
    id: string;
    modifiedsince: string;
  }
>;
//#endregion

//#region Raw Data
export interface CollectionRawItem {
  $: {
    objecttype: "thing";
    objectid: number;
    subtype: ThingType;
    collid: number;
  };
  name: { $: { sortindex: number }; _v: string };
  yearpublished: string;
  image: string;
  thumbnail: string;
  status: {
    own: number;
    prevowned: number;
    fortrade: number;
    want: number;
    wanttoplay: number;
    wanttobuy: number;
    wishlist: number;
    preordered: number;
    lastmodified: string;
  };
  numplays: string;
}

export interface RawRank {
  type: string;
  id: number;
  name: string;
  friendlyname: string;
  value: number;
  bayesaverage: number;
};

export interface CollectionRawItemWithStats extends CollectionRawItem {
  stats: {
    $: {
      minplayers: number;
      maxplayers: number;
      minplaytime: number;
      maxplaytime: number;
      playingtime: number;
      numowned: number;
    };
    rating: {
      $: { value: number | "N/A" };
      usersrated: { value: number };
      average: { value: number };
      bayesaverage: { value: number };
      stddev: { value: number };
      median: { value: number };
      ranks: {
        rank: OrArray<RawRank>;
      };
    };
  };
}

export interface CollectionRawResponse<T> {
  items: {
    $: {
      totalitems: number;
      termsofuse: string;
      pubdate: string;
    };
    item: Array<T>;
  };
}
//#endregion

//#region Response
export interface CollectionItem {
  name: string;
  gameId: string;
  subtype: ThingType;
  yearPublished: number;
  imageUri: string;
  thumbnailUri: string;
  status: {
    own: boolean;
    prevOwned: boolean;
    forTrade: boolean;
    want: boolean;
    wantToPlay: boolean;
    wantToBuy: boolean;
    wishlist: boolean;
    preordered: boolean;
    lastModified: Date;
  };
  numPlays: number;
}

export interface Rank {
  name: string;
  formattedName: string;
  rankingId: number;
  rank: number;
}

export interface CollectionItemWithStats extends CollectionItem {
  stats: {
    minPlayers: number;
    maxPlayers: number;
    minPlaytime: number;
    maxPlaytime: number;
    numOwned: number;
    collectionRating: number;
    usersRated: number;
    averageUserRating: number;
    geekRating: number;
    rank: number;
    rankData: Array<Rank>;
  };
}

export interface CollectionResponse<T> {
  totalItems: number;
  publishedDate: Date;
  items: Array<T>;
  termsOfUse: string;
}
//#endregion
