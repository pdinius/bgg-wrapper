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
  collectionItem: RawCollectionItem,
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

  const onWishlist = Boolean(status.wishlist);

  const res: CollectionItemInformation = {
    id: objectid,
    name: decodeEntities(_content),
    image,
    thumbnail,
    yearPublished: yearpublished ?? null,
    numPlays: numplays ?? 0,
    status: {
      own: Boolean(status.own),
      prevOwned: Boolean(status.prevowned),
      forTrade: Boolean(status.fortrade),
      want: Boolean(status.want),
      wantToPlay: Boolean(status.wanttoplay),
      wantToBuy: Boolean(status.wanttobuy),
      wishlist: onWishlist,
      wishlistPriority: onWishlist ? status.wishlistpriority : null,
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

    const ranksArr = rank ? invariantArray(rank) : [];

    res.statistics = {
      minPlayers: minPlayers ?? null,
      maxPlayers: maxPlayers ?? null,
      minPlayTime: minPlayTime ?? null,
      maxPlayTime: maxPlayTime ?? null,
      owned,
      rating: rating === "N/A" ? null : rating,
      usersRated,
      averageRating,
      geekRating,
      ranks:
        ranksArr.length === 0
          ? null
          : ranksArr.map((r) => ({
              id: r.id,
              category: r.name,
              label: r.friendlyname,
              rank: r.value === "Not Ranked" ? null : r.value,
            })),
    };
  }

  return res;
};

export const CollectionTransformer = (
  raw: RawCollectionResponse,
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
  collectionItem: CollectionItemInformation,
): CompleteDataCollectionItemInformation => {
  invariant(
    item.statistics,
    "Cannot transform item to complete data collection item without statistics object.",
  );
  const collectionStats: Omit<CollectionStatistics, "ranks"> &
    Partial<Pick<CollectionStatistics, "ranks">> = {
    ...invariant(
      collectionItem.statistics,
      "Cannot transform collection item to complete data collection item without statistics object.",
    ),
  };
  delete collectionStats.ranks;

  const {
    categories,
    mechanics,
    families,
    expands,
    expansions,
    accessories,
    reimplements,
    reimplementedBy,
    designers,
    artists,
    publishers,
  } = item;

  const suggestedPlayerAge = Object.entries(item.suggestedPlayerAgePoll).reduce(
    (a: { age: number | null; v: number }, [age, v]) => {
      return a.v > v ? a : { age: Number(age), v };
    },
    { age: null as number | null, v: -Infinity },
  ).age;

  return {
    ...collectionItem,
    categories,
    mechanics,
    families,
    expands,
    expansions,
    accessories,
    reimplements,
    reimplementedBy,
    designers,
    artists,
    publishers,
    statistics: {
      ...collectionStats,
      bestWith: Object.entries(item.suggestedNumPlayersPoll).reduce(
        (a: number[], [pc, votes]) => {
          return votes.best > votes.notRecommended &&
            votes.best > votes.recommended
            ? [...a, Number(pc)]
            : a;
        },
        [],
      ),
      recommendedWith: Object.entries(item.suggestedNumPlayersPoll).reduce(
        (a: number[], [pc, votes]) => {
          return votes.recommended + votes.best > votes.notRecommended
            ? [...a, Number(pc)]
            : a;
        },
        [],
      ),
      suggestedPlayerAge,
      languageDependence: item.languageDependencePoll.reduce(
        (a: { value: string; votes: number }, b) => {
          return a.votes > b.votes ? a : b;
        },
        { value: "", votes: -Infinity },
      ).value,
      rank: item.statistics?.ranks?.find((r) => r.id === 1)?.rank ?? null,
      trading: item.statistics?.trading ?? null,
      wanting: item.statistics?.wanting ?? null,
      wishing: item.statistics?.wishing ?? null,
      weight: item.statistics?.weight ?? null,
    },
  };
};
