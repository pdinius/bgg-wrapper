import {
  CollectionItem,
  CollectionItemWithStats,
  CollectionRawItem,
  CollectionRawItemWithStats,
  CollectionRawResponse,
  CollectionResponse,
  Rank,
  RawRank,
} from "../types/collection";
import { decode } from "html-entities";

const collectionItemTransformer = (raw: CollectionRawItem): CollectionItem => {
  return {
    name: decode(raw.name?._v),
    gameId: decode(raw.$.objectid.toString()),
    subtype: raw.$.subtype,
    yearPublished: parseInt(raw.yearpublished),
    imageUri: raw.image,
    thumbnailUri: raw.thumbnail,
    status: {
      own: Boolean(raw.status?.own),
      prevOwned: Boolean(raw.status?.prevowned),
      forTrade: Boolean(raw.status?.fortrade),
      want: Boolean(raw.status?.want),
      wantToPlay: Boolean(raw.status?.wanttoplay),
      wantToBuy: Boolean(raw.status?.wanttobuy),
      wishlist: Boolean(raw.status?.wishlist),
      preordered: Boolean(raw.status?.preordered),
      lastModified: new Date(raw.status?.lastmodified),
    },
    numPlays: parseInt(raw.numplays),
  };
};

const rankTransformer = (rank: RawRank): Rank => {
  return {
    name: rank.name,
    formattedName: rank.friendlyname,
    rankingId: rank.id,
    rank: rank.value,
  };
};

const collectionItemWithStatsTransformer = (
  raw: CollectionRawItemWithStats
): CollectionItemWithStats => {
  const baseItem = collectionItemTransformer(raw);
  const { stats } = raw;
  const ranks = Array.isArray(stats.rating.ranks.rank)
    ? stats.rating.ranks.rank
    : [stats.rating.ranks.rank];

  return {
    ...baseItem,
    stats: {
      minPlayers: stats.$.minplayers,
      maxPlayers: stats.$.maxplayers,
      minPlaytime: stats.$.minplaytime,
      maxPlaytime: stats.$.maxplaytime,
      numOwned: stats.$.numowned,
      collectionRating: stats.rating.$.value,
      usersRated: stats.rating.usersrated.value,
      averageUserRating: stats.rating.average.value,
      geekRating: stats.rating.bayesaverage.value,
      rank: ranks.find((r) => r.id === 1)?.value || -1,
      rankData: ranks.map(rankTransformer),
    },
  };
};

export const collectionTransformer =
  (expansionIds: Array<string>) =>
  (
    raw: CollectionRawResponse<CollectionRawItem>
  ): CollectionResponse<CollectionItem> => {
    const { items } = raw;

    return {
      totalItems: items?.$?.totalitems,
      publishedDate: new Date(items?.$?.pubdate),
      items: (
        items?.item.map((item) => {
          if (expansionIds.includes(item.$.objectid.toString())) {
            item.$.subtype = "boardgameexpansion";
          }
          return item;
        }) || []
      ).map(collectionItemTransformer),
      termsOfUse: items?.$?.termsofuse,
    };
  };

export const collectionTransformerWithStats =
  (expansionIds: Array<string>) =>
  (
    raw: CollectionRawResponse<CollectionRawItemWithStats>
  ): CollectionResponse<CollectionItemWithStats> => {
    const { items } = raw;

    console.log("not stats");

    return {
      totalItems: items?.$?.totalitems,
      publishedDate: new Date(items?.$?.pubdate),
      items: (
        items?.item.map((item) => {
          if (expansionIds.includes(item.$.objectid.toString())) {
            item.$.subtype = "boardgameexpansion";
          }
          return item;
        }) || []
      ).map(collectionItemWithStatsTransformer),
      termsOfUse: items?.$?.termsofuse,
    };
  };

export const expansionGamesToIds = (
  raw: CollectionRawResponse<CollectionRawItem>
): Array<string> => {
  return raw.items.item.map((v) => v.$.objectid.toString());
};
