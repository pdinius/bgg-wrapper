import { decodeEntities, invariant, invariantArray } from "../lib/utils";
import {
  CollectionItemInformation,
  CollectionResponse,
  CompleteDataCollectionItemInformation,
  CompleteDataCollectionResponse,
  RawCollectionItem,
  RawCollectionResponse,
} from "../types/collection";
import { ThingInformation, ThingResponse } from "../types/thing";

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
    name: decodeEntities(_content),
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

export const CompleteDataCollectionItemTransformer = (
  item: ThingInformation,
  collectionItem: CollectionItemInformation
): CompleteDataCollectionItemInformation => {
  const statistics = invariant(
    item.statistics,
    "Cannot transform item to complete data collection item without statistics object."
  );
  const collectionStats = invariant(
    collectionItem.statistics,
    "Cannot transform collection item to complete data collection item without statistics object."
  );
  return {
    ...item,
    ...collectionItem,
    statistics,
    rating: collectionStats.rating,
  };
};

export const CompleteDataCollectionTransformer = (
  rawCollection: CollectionItemInformation[],
  rawItems: ThingInformation[]
): CompleteDataCollectionItemInformation[] => {
  return rawItems.map((item) =>
    CompleteDataCollectionItemTransformer(
      item,
      invariant(
        rawCollection.find((v) => v.id === item.id),
        `Item with id ${item.id} not found in collection.`
      )
    )
  );
};
