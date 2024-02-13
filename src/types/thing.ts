import { OrArray } from "../utils";
import { NameType, ThingType } from "./general";

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
      poll: Array<{
        $: {
          totalvotes: number;
        } & (
          | {
              name: "suggested_numplayers";
              title: "User Suggested Number of Players";
            }
          | {
              name: "suggested_playerage";
              title: "User Suggested Player Age";
            }
          | {
              name: "language_dependence";
              title: "Language Dependence";
            }
        );
      }>;
    }>;
  };
};

export type ThingResponse = {};
