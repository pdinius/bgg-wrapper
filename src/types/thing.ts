import {
  CompleteDataCollectionItemInformation,
  CompleteStatistics,
} from "./collection";
import {
  LanguageDependenceLevel,
  LinkType,
  NameType,
  ThingType,
} from "./general";

// Options

export interface ThingOptions {
  stats: boolean;
  versions: boolean;
  videos: boolean;
  marketplace: boolean;
  comments: boolean;
  ratings: boolean;
  page: number;
  truncated: boolean;
}

// Raw Response

interface RawThingName {
  type: NameType;
  sortIndex: number;
  value: string;
}

export interface RawLink {
  type: LinkType;
  id: number;
  value: string;
  inbound?: "true";
}

export interface RawSuggestedPlayersPollResult {
  $: {
    numplayers: number;
  };
  result: [
    {
      value: "Best";
      numvotes: number;
    },
    {
      value: "Recommended";
      numvotes: number;
    },
    {
      value: "Not Recommended";
      numvotes: number;
    }
  ];
}

export interface RawSuggestedPlayerAgePollResult {
  value: number | "21 and up";
  numvotes: number;
}

export interface RawLanguageDependencePollResult {
  level: number;
  value: LanguageDependenceLevel;
  numvotes: number;
}

interface RawComment {
  username: string;
  rating: number | "N/A";
  value: string;
}

export interface RawComments {
  $: {
    page: number;
    totalitems: number;
  };
  comment: RawComment[];
}

export interface RawListing {
  listdate: {
    value: string;
  };
  price: {
    currency: string;
    value: number;
  };
  condition: {
    value: string;
  };
  notes: {
    value: string;
  };
  link: {
    href: string;
    title: string;
  };
}

export interface RawMarketplaceInformation {
  listing: RawListing[];
}

export interface RawVideoInformation {
  id: number;
  title: string;
  category: string;
  language: string;
  link: string;
  username: string;
  userid: number;
  postdate: string;
}

export interface RawVersion {
  $: {
    type: ThingType;
    id: number;
  };
  thumbnail: string;
  image: string;
  link: RawLink[];
  name: RawThingName;
  yearpublished: {
    value: number;
  };
  productcode: {
    value?: string;
  };
  width: {
    value: number;
  };
  length: {
    value: number;
  };
  depth: {
    value: number;
  };
  weight: {
    value: number;
  };
}

interface ItemRank {
  type: string;
  id: number;
  name: string;
  friendlyname: string;
  value: number;
  bayesaverage: number;
}

export interface RawStatistics {
  $: {
    page: number;
  };
  ratings: {
    usersrated: {
      value: number;
    };
    average: {
      value: number;
    };
    bayesaverage: {
      value: number;
    };
    ranks: {
      rank: ItemRank | ItemRank[];
    };
    stddev: {
      value: number;
    };
    median: {
      value: number;
    };
    owned: {
      value: number;
    };
    trading: {
      value: number;
    };
    wanting: {
      value: number;
    };
    wishing: {
      value: number;
    };
    numcomments: {
      value: number;
    };
    numweights: {
      value: number;
    };
    averageweight: {
      value: number;
    };
  };
}

export interface RawItem {
  $: {
    type: ThingType;
    id: number;
  };
  thumbnail: string;
  image: string;
  name: RawThingName[];
  description: string;
  yearpublished: {
    value: number;
  };
  minplayers: {
    value: number;
  };
  maxplayers: {
    value: number;
  };
  poll: [
    {
      $: {
        name: "suggested_numplayers";
        title: "User Suggested Number of Players";
        totalvotes: number;
      };
      results: RawSuggestedPlayersPollResult[];
    },
    {
      $: {
        name: "suggested_playerage";
        title: "User Suggested Player Age";
        totalvotes: number;
      };
      results: {
        result: RawSuggestedPlayerAgePollResult[];
      };
    },
    {
      $: {
        name: "language_dependence";
        title: "Language Dependence";
        totalvotes: 66;
      };
      results: {
        result: RawLanguageDependencePollResult[];
      };
    }
  ];
  "poll-summary": {
    $: {
      name: "suggested_numplayers";
      title: "User Suggested Number of Players";
    };
    result: {
      name: "bestwith" | "recommmendedwith";
      value: string;
    }[];
  };
  playingtime: {
    value: number;
  };
  minplaytime: {
    value: number;
  };
  maxplaytime: {
    value: number;
  };
  minage: {
    value: number;
  };
  link: RawLink[];
  comments?: RawComments;
  marketplacelistings?: RawMarketplaceInformation;
  versions?: {
    item: RawVersion[];
  };
  videos?: {
    $: {
      total: number;
    };
    video: RawVideoInformation[];
  };
  statistics?: RawStatistics;
}

export interface RawThingResponse {
  items: {
    $: {
      termsofuse: string;
    };
    item: RawItem | RawItem[];
  };
}

// Returned Item

export interface SuggestedPlayerVotes {
  best: number;
  recommended: number;
  notRecommended: number;
}

export interface LanguageDependenceVotes {
  votes: number;
  value: string;
}

export interface LinkInformation {
  id: number;
  value: string;
}

export interface RankInformation {
  id: number;
  category: string;
  label: string;
  rank: number;
}

export interface Statistics {
  usersRated: number;
  averageRating: number;
  geekRating: number;
  ranks: RankInformation[] | null;
  owned: number;
  trading: number;
  wanting: number;
  wishing: number;
  numComments: number;
  numWeights: number;
  weight: number;
}

export interface Version {
  id: number;
  thumbnail: string;
  image: string;
  name: string;
  productCode?: string;
  yearPublished: number;
  width: number;
  length: number;
  depth: number;
  weight: number;
}

export interface ThingInformation {
  id: number;
  type: ThingType;
  name: string;
  alternateNames: string[];
  image: string;
  thumbnail: string;
  description: string;
  yearPublished: number;
  minPlayers: number;
  maxPlayers: number;
  playingTime: number;
  minPlayTime: number;
  maxPlayTime: number;
  minAge: number;
  bestWith: string;
  recommendedWith: string;
  suggestedNumPlayersPoll: {
    [key: number]: SuggestedPlayerVotes;
  };
  suggestedPlayerAgePoll: {
    [key: number]: number;
  };
  languageDependencePoll: LanguageDependenceVotes[];
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
  statistics?: Statistics;
  versions?: Version[];
}

export interface ThingResponse {
  termsOfUse: string;
  items: ThingInformation[];
}

export interface TruncatedThingInformation
  extends Omit<
    CompleteDataCollectionItemInformation,
    "statistics" | "numPlays" | "status"
  > {
  type: ThingType;
  statistics: Omit<CompleteStatistics, "rating">;
}
