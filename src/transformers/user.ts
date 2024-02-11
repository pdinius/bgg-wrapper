import {
  BuddyInfo,
  GuildInfo,
  HotInfo,
  UserRawResponse,
  UserResponse,
} from "../types/user";

const buddyAndGuildTransformer = (raw: { id: number; name: string }) => {
  return {
    id: String(raw.id),
    name: raw.name,
  };
};

const hotItemTransformer = (raw: {
  rank: number;
  type: "thing";
  id: number;
  name: string;
}) => {
  return {
    id: String(raw.id),
    name: raw.name,
    rank: raw.rank,
  };
};

export const userTransformer = ({ user }: UserRawResponse): UserResponse => {
  if (user === undefined) {
    throw Error("User object was undefined.");
  }

  const {
    $,
    firstname,
    lastname,
    avatarlink,
    yearregistered,
    stateorprovince,
    country,
    webaddress,
    xboxaccount,
    wiiaccount,
    psnaccount,
    battlenetaccount,
    steamaccount,
    traderating,
    buddies,
    guilds,
    hot,
  } = user;

  const buddyMetadata: { total?: number; page?: number } =
    buddies === undefined ? {} : "$" in buddies ? buddies?.$ : buddies;
  const guildMetadata: { total?: number; page?: number } =
    guilds === undefined ? {} : "$" in guilds ? guilds?.$ : guilds;

  let buddyArr: Array<BuddyInfo> = [];
  let guildArr: Array<GuildInfo> = [];
  let hotArr: Array<HotInfo> = [];

  if (
    buddies !== undefined &&
    "buddy" in buddies &&
    buddies.buddy !== undefined
  ) {
    if (Array.isArray(buddies.buddy)) {
      buddyArr = buddies.buddy.map(buddyAndGuildTransformer);
    } else {
      buddyArr = [buddyAndGuildTransformer(buddies.buddy)];
    }
  }

  if (guilds !== undefined && "guild" in guilds && guilds.guild !== undefined) {
    if (Array.isArray(guilds.guild)) {
      guildArr = guilds.guild.map(buddyAndGuildTransformer);
    } else {
      guildArr = [buddyAndGuildTransformer(guilds.guild)];
    }
  }

  if (hot?.item) {
    if (Array.isArray(hot?.item)) {
      hotArr = hot.item.map(hotItemTransformer);
    } else {
      hotArr = [hotItemTransformer(hot.item)];
    }
  }

  return {
    id: String($?.id),
    name: $?.name,
    firstName: firstname?.value,
    lastName: lastname?.value,
    avatarLink: avatarlink?.value,
    yearRegistered: Number(yearregistered?.value) || undefined,
    stateOrProvince: stateorprovince?.value,
    country: country?.value,
    website: webaddress?.value,
    xboxAccount: xboxaccount?.value,
    wiiAccount: wiiaccount?.value,
    psnAccount: psnaccount?.value,
    battlenetAccount: battlenetaccount?.value,
    steamAccount: steamaccount?.value,
    tradeRating: traderating?.value,
    buddies: buddyArr,
    guilds: guildArr,
    page: buddyMetadata.page || guildMetadata.page || undefined,
    hot: hotArr,
    termsOfUse: $?.termsofuse,
  };
};
