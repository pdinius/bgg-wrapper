import {
  CollectionItemInformation,
  RawCollectionItem,
  RawCollectionResponse,
} from "../types/collection";

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

export const CollectionTransformer = (raw: RawCollectionResponse) => {
  const {
    items: { $, item },
  } = raw;

  const termsOfUse = $.termsofuse;

  return {
    termsOfUse,
    items: Array.isArray(item)
      ? item.map(RawCollectionTransformer)
      : [item].map(RawCollectionTransformer),
  };
};
