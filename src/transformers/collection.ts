import { decodeEntities, invariant, invariantArray } from "../shared/utils";
import {
  CollectionItemInformation,
  CollectionResponse,
  CollectionStatistics,
  CompleteDataCollectionItemInformation,
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
    name: decodeEntities(_content),
    image,
    thumbnail,
    yearPublished: yearpublished || null,
    numPlays: numplays || 0,
    status: {
      own: Boolean(status.own),
      prevOwned: Boolean(status.prevowned),
      forTrade: Boolean(status.fortrade),
      want: Boolean(status.want),
      wantToPlay: Boolean(status.wanttoplay),
      wantToBuy: Boolean(status.wanttobuy),
      wishlist: (status.wishlist && status.wishlistpriority) || 0,
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
      minPlayers: minPlayers || -1,
      maxPlayers: maxPlayers || -1,
      minPlayTime: minPlayTime || -1,
      maxPlayTime: maxPlayTime || -1,
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
  const collectionStats: Omit<CollectionStatistics, "ranks"> &
    Partial<Pick<CollectionStatistics, "ranks">> = invariant(
    collectionItem.statistics,
    "Cannot transform collection item to complete data collection item without statistics object."
  );
  delete collectionStats.ranks;

  const {
    categories,
    mechanics,
    families,
    expansions,
    accessories,
    reimplements,
    reimplementedBy,
    designers,
    artists,
    publishers,
  } = item;
  return {
    ...collectionItem,
    categories,
    mechanics,
    families,
    expansions,
    accessories,
    reimplements,
    reimplementedBy,
    designers,
    artists,
    publishers,
    statistics: {
      ...collectionStats,
      rating: collectionStats.rating || -1,
      bestWith: Object.entries(item.suggestedNumPlayersPoll).reduce(
        (a: number[], [pc, votes]) => {
          return votes.best > votes.notRecommended &&
            votes.best > votes.recommended
            ? [...a, Number(pc)]
            : a;
        },
        []
      ),
      recommendedWith: Object.entries(item.suggestedNumPlayersPoll).reduce(
        (a: number[], [pc, votes]) => {
          return votes.recommended + votes.best > votes.notRecommended
            ? [...a, Number(pc)]
            : a;
        },
        []
      ),
      suggestedPlayerAge: Object.entries(item.suggestedPlayerAgePoll).reduce(
        (a: { age: number; v: number; }, [age, v]) => {
          return a.v > v ? a : { age: Number(age), v };
        },
        { age: -1, v: -Infinity }
      ).age,
      languageDependence: item.languageDependencePoll.reduce(
        (a: { value: string; votes: number; }, b) => {
          return a.votes > b.votes ? a : b;
        },
        { value: "", votes: -Infinity }
      ).value,
      rank: item.statistics?.ranks?.find((r) => r.id === 1)?.rank || -1,
      trading: item.statistics?.trading || -1,
      wanting: item.statistics?.wanting || -1,
      wishing: item.statistics?.wishing || -1,
      weight: item.statistics?.weight || -1,
    },
  };
};
