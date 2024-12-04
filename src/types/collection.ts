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

export type CollectionOptionsClean = Partial<CollectionOptions & {
  id: string;
  modifiedsince: string;
}>
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

export interface CollectionRawResponse {
  items: {
    $: {
      totalitems: number;
      termsofuse: string;
      pubdate: string;
    };
    item: Array<CollectionRawItem>;
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

export interface CollectionResponse {
  totalItems: number;
  publishedDate: Date;
  items: Array<CollectionItem>;
  termsOfUse: string;
}
//#endregion
