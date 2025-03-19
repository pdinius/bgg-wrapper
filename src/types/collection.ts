// Options

import { RankInformation, ThingInformation } from "./thing";

export interface CollectionOptions {
  stats: boolean;
  excludesubtype: "boardgameexpansion";
}

// Raw Response

export interface CollectionRank {
  type: string;
  id: number;
  name: string;
  friendlyname: string;
  value: number | "Not Ranked";
  bayesaverage: number;
}

export interface RawCollectionItem {
  $: {
    objecttype: "thing";
    objectid: number;
    subtype: "boardgame";
    collid: number;
  };
  name: {
    $: {
      sortindex: number;
    };
    _content: string;
  };
  yearpublished: number;
  image: string;
  thumbnail: string;
  numplays: number;
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
  stats?: {
    $: {
      minplayers: number;
      maxplayers: number;
      minplaytime: number;
      maxplaytime: number;
      playingtime: number;
      numowned: number;
    };
    rating: {
      $: {
        value: number | "N/A";
      };
      usersrated: {
        value: number;
      };
      average: {
        value: number;
      };
      bayesaverage: {
        value: number;
      };
      stddev: {
        value: number;
      };
      median: {
        value: number;
      };
      ranks: {
        rank: CollectionRank | CollectionRank[];
      };
    };
  };
}

export interface RawCollectionResponse {
  items: {
    $: {
      totalitems: number;
      termsofuse: string;
      pubdate: string;
    };
    item: RawCollectionItem | RawCollectionItem[];
  };
}

// Returned Item

export interface CollectionStatistics {
  minPlayers: number;
  maxPlayers: number;
  minPlayTime: number;
  maxPlayTime: number;
  owned: number;
  rating: number | null;
  usersRated: number;
  averageRating: number;
  geekRating: number;
  ranks: RankInformation[];
}

export interface CollectionItemInformation {
  id: number;
  name: string;
  image: string;
  thumbnail: string;
  yearPublished: number;
  numPlays: number;
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
  statistics?: CollectionStatistics;
}

export interface CompleteDataCollectionItemInformation
  extends Omit<CollectionItemInformation, "statistics">,
    ThingInformation {
  rating: number | null;
}

export interface CollectionResponse {
  termsOfUse: string;
  retrievalDate: Date;
  items: CollectionItemInformation[];
}

export interface CompleteDataCollectionResponse {
  termsOfUse: string;
  retrievalDate: Date;
  items: CompleteDataCollectionItemInformation[];
}
