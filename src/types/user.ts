import { OrArray } from "../lib/utils";
import { ThingType } from "./general";

//#region Options
export type UserOptions = {
  buddies?: boolean;
  guilds?: boolean;
  hot?: boolean;
  top?: boolean;
  page?: number;
};

export type BuddiesOptions = {
  page: number;
};

export type GuildsOptions = {
  page: number;
};
//#endregion

//#region Raw Data
export type UserRawResponse = {
  user: {
    $: {
      id: number;
      name: string;
      termsofuse: string;
    };
    firstname: {
      value?: string;
    };
    lastname: {
      value?: string;
    };
    avatarlink: {
      value?: string;
    };
    yearregistered: {
      value?: string;
    };
    stateorprovince: {
      value?: string;
    };
    country: {
      value?: string;
    };
    webaddress: {
      value?: string;
    };
    xboxaccount: {
      value?: string;
    };
    wiiaccount: {
      value?: string;
    };
    psnaccount: {
      value?: string;
    };
    battlenetaccount: {
      value?: string;
    };
    steamaccount: {
      value?: string;
    };
    traderating: {
      value?: number;
    };
    buddies?:
      | {
          $: {
            total: number;
            page: number;
          };
          buddy?: OrArray<{
            id: number;
            name: string;
          }>;
        }
      | {
          total: number;
          page: number;
        };
    guilds?:
      | {
          $: {
            total: number;
            page: number;
          };
          guild?: OrArray<{
            id: number;
            name: string;
          }>;
        }
      | {
          total: number;
          page: number;
        };
    hot?: {
      $: {
        domain: ThingType;
      };
      item: OrArray<{
        rank: number;
        type: "thing";
        id: number;
        name: string;
      }>;
    };
  };
};
//#endregion

//#region Response
export type BuddyInfo = {
  id: string;
  name: string;
};

export type GuildInfo = {
  id: string;
  name: string;
};

export type HotInfo = {
  rank: number;
  id: string;
  name: string;
}

export type UserResponse = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatarLink?: string;
  yearRegistered?: number;
  stateOrProvince?: string;
  country?: string;
  website?: string;
  xboxAccount?: string;
  wiiAccount?: string;
  psnAccount?: string;
  battlenetAccount?: string;
  steamAccount?: string;
  tradeRating?: number;
  buddies?: Array<BuddyInfo>;
  guilds?: Array<GuildInfo>;
  page?: number;
  hot?: Array<HotInfo>; 
  termsOfUse: string;
};
//#endregion
