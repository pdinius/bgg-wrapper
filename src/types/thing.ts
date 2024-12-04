import { LANGUAGE_DEPENDENCE_LABELS } from "../lib/constants";
import { OrArray } from "../lib/utils";
import { LinkType, NameType, ThingType } from "./general";

//#region Options
export type ThingOptions = Partial<{
  type: ThingType;
  versions: boolean;
  videos: boolean;
  stats: boolean;
  marketplace: boolean;
  comments: boolean;
  ratingcomments: boolean;
  page: number;
}>;
//#endregion

//#region Raw Data
export type PlayerCountPollResultRaw = {
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
};

export type PlayerCountPollRaw = {
  $: {
    name: "suggested_numplayers";
    title: "User Suggested Number of Players";
    totalvotes: number;
  };
  results: OrArray<PlayerCountPollResultRaw>;
};

export type SuggestedPlayerAgePollResultRaw = {
  value: number | string;
  numvotes: number;
};

export type SuggestedPlayerAgePollRaw = {
  $: {
    name: "suggested_playerage";
    title: "User Suggested Player Age";
    totalvotes: number;
  };
  results: {
    result: OrArray<SuggestedPlayerAgePollResultRaw>;
  };
};

export type LanguageDependencePollResultRaw = {
  level: number;
  value: (typeof LANGUAGE_DEPENDENCE_LABELS)[number];
  numvotes: number;
};

export type LanguageDependencePollRaw = {
  $: {
    name: "language_dependence";
    title: "Language Dependence";
    totalvotes: number;
  };
  results: {
    result: Array<LanguageDependencePollResultRaw>;
  };
};

export type LinkRaw = {
  type: LinkType;
  id: number;
  value: string;
};

export type CommentRaw = {
  username: string;
  rating: number;
  value: string;
};

export type ThingRaw = Partial<{
  $: {
    type: ThingType;
    id: number;
  };
  thumbnail: string;
  image: string;
  name: OrArray<{
    type: NameType;
    sortindex: number;
    value: string;
  }>;
  description: string;
  yearpublished: {
    value: string;
  };
  minplayers: {
    value: number;
  };
  maxplayers: {
    value: number;
  };
  poll: Array<
    PlayerCountPollRaw | SuggestedPlayerAgePollRaw | LanguageDependencePollRaw
  >;
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
  link: OrArray<LinkRaw>;
  statistics: {
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
        rank: OrArray<{
          type: string;
          id: number;
          name: string;
          friendlyname: string;
          value: number;
          bayesaverage: number;
        }>;
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
    comments?: {
      $: {
        page: number;
        totalitems: number;
      };
      comment: Array<CommentRaw>;
    };
  };
}>;

export type ThingRawResponse = {
  items: {
    $: {
      termsofuse: string;
    };
    item: OrArray<ThingRaw>;
  };
};
//#endregion

//#region Response
export type Link = {
  type: LinkType;
  id: string;
  name: string;
};

export type SuggestedPlayerCountPollResult = {
  playerCount: number;
  best: number;
  recommended: number;
  notRecommended: number;
};

export type SuggestedPlayerAgePollResult = {
  age: number;
  numVotes: number;
};

export type LanguageDependencePollResult = {
  level: number;
  label: string;
  numVotes: number;
};

export type FamilyRank = {
  id: String;
  name: string;
  label: string;
  rank: number;
  bayesAverage: number;
};

export type Stats = {
  rank: number;
  familyRanks: Array<FamilyRank>;
  avgRating: number;
  bayesAverage: number;
  stdDev: number;
  median: number;
  weight: number;
  users: {
    rated: number;
    owned: number;
    forTrade: number;
    wantInTrade: number;
    wishlist: number;
    commented: number;
    weightVote: number;
  };
};

export type Thing = {
  id: string;
  name: string;
  type: ThingType;
  thumbnail?: string;
  image?: string;
  alternateNames: Array<string>;
  description?: string;
  yearPublished: number;
  minPlayers: number;
  maxPlayers: number;
  playTime: number;
  minPlayTime: number;
  maxPlayTime: number;
  minAge: number;
  recommendedPlayerCounts: Array<number>;
  bestPlayerCounts: Array<number>;
  suggestedPlayerAge: number;
  playerCountPoll: {
    label: string;
    totalVotes: number;
    results: Array<SuggestedPlayerCountPollResult>;
  };
  suggestedPlayerAgePoll: {
    label: string;
    totalVotes: number;
    results: Array<SuggestedPlayerAgePollResult>;
  };
  languageDependencePoll: {
    label: string;
    totalVotes: number;
    results: Array<LanguageDependencePollResult>;
  };
  links: Array<Link>;
  stats?: Stats;
};

export type ThingResponse = {
  items: Array<Thing>;
  termsofuse: string;
};
//#endregion
