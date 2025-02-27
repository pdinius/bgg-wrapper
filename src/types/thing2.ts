import {
  LanguageDependenceLevel,
  LinkType,
  NameType,
  ThingType,
} from "./general";

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
}

export interface RawThingResponse {
  items: {
    $: {
      termsofuse: string;
    };
    item: RawItem | RawItem[];
  };
}

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
