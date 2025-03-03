import {
  LanguageDependenceLevel,
  LinkType,
  NameType,
  ThingType,
} from "./general";

// Raw Response

export interface ThingOptions {
  versions: boolean;
  videos: boolean;
  stats: boolean;
  marketplace: boolean;
  comments: boolean;
  ratings: boolean;
  page: number;
}

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
        name: "suggested_numplayers";
        title: "User Suggested Number of Players";
      };
      result: {
        name: "bestwith" | "recommmendedwith";
        value: string;
      }[];
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

export interface ItemInformation {
  id: number;
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
  expansions: LinkInformation[];
  accessories: LinkInformation[];
  reimplements: LinkInformation[];
  reimplementedBy: LinkInformation[];
  designers: LinkInformation[];
  artists: LinkInformation[];
  publishers: LinkInformation[];
}

export interface ThingResponse {
  termsOfUse: string;
  items: ItemInformation[];
}
