import { OrArray } from "../helpers";
import { LinkType, NameType, ThingType } from "./general";

export type ThingOptions = {
  type: ThingType;
  versions: boolean;
  videos: boolean;
  stats: boolean;
  marketplace: boolean;
  comments: boolean;
  ratingcomments: boolean;
  page: number;
  pagesize: number;
};

export type PlayerCountPollRawResult = {
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
    value: string;
  };
  maxplayers: {
    value: string;
  };
  poll: Array<
    | {
        $: {
          name: "suggested_numplayers";
          title: "User Suggested Number of Players";
          totalvotes: number;
        };
        results: OrArray<{
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
        }>;
      }
    | {
        $: {
          name: "suggested_playerage";
          title: "User Suggested Player Age";
          totalvotes: number;
        };
        results: {
          result: OrArray<{
            value: number;
            numvotes: number;
          }>;
        };
      }
    | {
        $: {
          name: "language_dependence";
          title: "Language Dependence";
          totalvotes: number;
        };
        results: {
          result: [
            {
              level: 1;
              value: "No necessary in-game text";
              numvotes: number;
            },
            {
              level: 2;
              value: "Some necessary text - easily memorized or small crib sheet";
              numvotes: number;
            },
            {
              level: 3;
              value: "Moderate in-game text - needs crib sheet or paste ups";
              numvotes: number;
            },
            {
              level: 4;
              value: "Extensive use of text - massive conversion needed to be playable";
              numvotes: number;
            },
            {
              level: 5;
              value: "Unplayable in another language";
              numvotes: number;
            }
          ];
        };
      }
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
  link: OrArray<{
    type: LinkType;
    id: number;
    value: string;
  }>;
}>;

export type ThingRawResponse = {
  items: {
    $: {
      termsofuse: string;
    };
    item: OrArray<ThingRaw>;
  };
};

type Link = {
  type: LinkType;
  id: string;
  name: string;
};

export type SuggestedPlayerCountPollResult = {
  playerCount: number;
  bestVotes: number;
  recommendedVotes: number;
  notRecommendedVotes: number;
};

export type Thing = {
  id: string;
  name: string;
  type: ThingType;
  thumbnail: string;
  image: string;
  alternateNames: Array<string>;
  description: string;
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
  weight: number;
  playerCountPoll: {
    label: string;
    totalVotes: number;
    results: Array<SuggestedPlayerCountPollResult>;
  };
  suggestedPlayerAgePoll: {
    label: string;
    totalVotes: number;
    results: Array<{
      age: number;
      votes: number;
    }>;
  };
  languageDependencePoll: {
    label: string;
    totalVotes: number;
    results: Array<{
      label: string;
      level: number;
      votes: number;
    }>;
  };
  links: Array<Link>;
};

export type ThingResponse = {
  items: Array<Thing>;
  termsofuse: string;
};
