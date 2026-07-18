import { LinkInformation, RankInformation } from "./thing";
import { ThingType } from "./general";

export type CollectionSubtype = Extract<
  ThingType,
  "boardgame" | "boardgameexpansion" | "boardgameaccessory"
>;

export interface CollectionOptions {
  version: boolean;
  subtype: CollectionSubtype;
  excludesubtype: CollectionSubtype;
  id: string | number;
  own: boolean;
  rated: boolean;
  played: boolean;
  comment: boolean;
  trade: boolean;
  want: boolean;
  wishlist: boolean;
  wishlistpriority: 1 | 2 | 3 | 4 | 5;
  preordered: boolean;
  wanttoplay: boolean;
  wanttobuy: boolean;
  prevowned: boolean;
  hasparts: boolean;
  wantparts: boolean;
  minrating: number;
  rating: number;
  minbggrating: number;
  bggrating: number;
  minplays: number;
  maxplays: number;
  showprivate: boolean;
  stats: boolean;
  modifiedsince: string;
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
  yearpublished?: number;
  image: string;
  thumbnail: string;
  numplays?: number;
  status: {
    own: number;
    prevowned: number;
    fortrade: number;
    want: number;
    wanttoplay: number;
    wanttobuy: number;
    wishlist: number;
    wishlistpriority: number;
    preordered: number;
    lastmodified: string;
  };
  stats?: {
    $: {
      minplayers?: number;
      maxplayers?: number;
      minplaytime?: number;
      maxplaytime?: number;
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
  minPlayers: number | null;
  maxPlayers: number | null;
  minPlayTime: number | null;
  maxPlayTime: number | null;
  owned: number;
  rating: number | null;
  usersRated: number;
  averageRating: number;
  geekRating: number;
  ranks: RankInformation[] | null;
}

export interface CollectionItemInformation {
  id: number;
  name: string;
  image: string;
  thumbnail: string;
  yearPublished: number | null;
  numPlays: number;
  status: {
    own: boolean;
    prevOwned: boolean;
    forTrade: boolean;
    want: boolean;
    wantToPlay: boolean;
    wantToBuy: boolean;
    wishlist: boolean;
    wishlistPriority: number | null;
    preordered: boolean;
    lastModified: Date;
  };
  statistics?: CollectionStatistics;
}

export interface CompleteStatistics extends Omit<CollectionStatistics, "ranks"> {
  bestWith: number[];
  recommendedWith: number[];
  suggestedPlayerAge: number | null;
  languageDependence: string;
  rank: number | null;
  trading: number | null;
  wanting: number | null;
  wishing: number | null;
  weight: number | null;
}

export interface CompleteDataCollectionItemInformation
  extends Omit<CollectionItemInformation, "statistics"> {
  statistics: CompleteStatistics;
  categories: LinkInformation[];
  mechanics: LinkInformation[];
  families: LinkInformation[];
  expands: LinkInformation[];
  expansions: LinkInformation[];
  accessories: LinkInformation[];
  reimplements: LinkInformation[];
  reimplementedBy: LinkInformation[];
  designers: LinkInformation[];
  artists: LinkInformation[];
  publishers: LinkInformation[];
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
