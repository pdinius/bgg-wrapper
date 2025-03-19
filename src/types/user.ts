export interface RawUserResponse {
  user: {
    $: {
      id: number;
      name: string;
      termsofuse: string;
    };
    firstname: { value?: string };
    lastname: { value?: string };
    avatarlink: { value?: string };
    yearregistered: { value?: number };
    lastlogin: { value?: string };
    stateorprovince: { value?: string };
    country: { value?: string };
    webaddress: { value?: string };
    xboxaccount: { value?: string };
    wiiaccount: { value?: string };
    psnaccount: { value?: string };
    battlenetaccount: { value?: string };
    steamaccount: { value?: string };
    traderating: { value?: number };
  };
}

export interface UserResponse {
  termsOfUse: string;
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarLink?: string;
  yearRegistered?: number;
  lastLogin?: Date;
  stateOrProvince?: string;
  country?: string;
  webAddress?: string;
  xboxAccount?: string;
  wiiAccount?: string;
  psnAccount?: string;
  battleNetAccount?: string;
  steamAccount?: string;
  tradeRating?: number;
}
