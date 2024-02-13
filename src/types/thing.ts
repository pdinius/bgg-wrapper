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

export type ThingRawResponse = {
  items: {
    $: {
      termsofuse: string;
    };
    item: OrArray<{
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
  };
};

export type ThingResponse = {};
