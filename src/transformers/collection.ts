import { invariant, invariantArray } from "../lib/utils";
import {
  CollectionItemInformation,
  CollectionResponse,
  MegaCollectionItemInformation,
  MegaCollectionResponse,
  RawCollectionItem,
  RawCollectionResponse,
} from "../types/collection";
import { ThingInformation } from "../types/thing";

const RawCollectionTransformer = (
  collectionItem: RawCollectionItem
): CollectionItemInformation => {
  const {
    $: { objectid },
    name: { _content },
    yearpublished,
    image,
    thumbnail,
    numplays,
    status,
    stats,
  } = collectionItem;

  const res: CollectionItemInformation = {
    id: objectid,
    name: _content,
    image,
    thumbnail,
    yearPublished: yearpublished,
    numPlays: numplays,
    status: {
      own: Boolean(status.own),
      prevOwned: Boolean(status.prevowned),
      forTrade: Boolean(status.fortrade),
      want: Boolean(status.want),
      wantToPlay: Boolean(status.wanttoplay),
      wantToBuy: Boolean(status.wanttobuy),
      wishlist: Boolean(status.wishlist),
      preordered: Boolean(status.preordered),
      lastModified: new Date(status.lastmodified),
    },
  };

  if (stats !== undefined) {
    const {
      $: {
        minplayers: minPlayers,
        maxplayers: maxPlayers,
        minplaytime: minPlayTime,
        maxplaytime: maxPlayTime,
        numowned: owned,
      },
      rating: {
        $: { value: rating },
        usersrated: { value: usersRated },
        average: { value: averageRating },
        bayesaverage: { value: geekRating },
        ranks: { rank },
      },
    } = stats;

    const ranksArr = Array.isArray(rank) ? rank : [rank];

    res.statistics = {
      minPlayers,
      maxPlayers,
      minPlayTime,
      maxPlayTime,
      owned,
      rating: rating === "N/A" ? -1 : rating,
      usersRated,
      averageRating,
      geekRating,
      ranks: ranksArr.map((r) => ({
        id: r.id,
        category: r.name,
        label: r.friendlyname,
        rank: r.value === "Not Ranked" ? -1 : r.value,
      })),
    };
  }

  return res;
};

export const CollectionTransformer = (
  raw: RawCollectionResponse
): CollectionResponse => {
  const {
    items: {
      $: { termsofuse: termsOfUse, pubdate },
      item,
    },
  } = raw;

  return {
    termsOfUse,
    retrievalDate: new Date(pubdate),
    items: invariantArray(item).map(RawCollectionTransformer),
  };
};

export const MegaCollectionItemTransformer = (
  item: ThingInformation,
  collectionItem: CollectionItemInformation
): MegaCollectionItemInformation => {
  const statistics = invariant(
    item.statistics,
    "Cannot transform item to mega collection item with statistics object."
  );
  const collectionStats = invariant(
    collectionItem.statistics,
    "Cannot transform collection item to mega collection item with statistics object."
  );
  return {
    ...item,
    ...collectionItem,
    statistics,
    rating: collectionStats.rating,
  };
};

export const MegaCollectionTransformer = (
  rawCollection: CollectionResponse,
  rawItems: ThingInformation[]
): MegaCollectionResponse => {
  const newItems = rawItems.map((item) =>
    MegaCollectionItemTransformer(
      item,
      invariant(
        rawCollection.items.find((v) => v.id === item.id),
        `Item with id ${item.id} not found in collection.`
      )
    )
  );
  const { termsOfUse, retrievalDate } = rawCollection;

  return {
    termsOfUse,
    retrievalDate,
    items: newItems,
  };
};
