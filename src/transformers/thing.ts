import { decodeEntities, invariant, invariantArray } from "../shared/utils";
import { LinkType } from "../types/general";
import {
  ThingInformation,
  LanguageDependenceVotes,
  LinkInformation,
  RawItem,
  RawLanguageDependencePollResult,
  RawLink,
  RawSuggestedPlayerAgePollResult,
  RawSuggestedPlayersPollResult,
  RawThingResponse,
  RawVersion,
  SuggestedPlayerVotes,
  ThingResponse,
  TruncatedThingInformation,
} from "../types/thing";

const BLANK_PLAYER_AGE_POLL = {
  "2": 0,
  "3": 0,
  "4": 0,
  "5": 0,
  "6": 0,
  "8": 0,
  "10": 0,
  "12": 0,
  "14": 0,
  "16": 0,
  "18": 0,
  "21": 0,
};

const BLANK_LANGUAGE_DEPENDENCE_POLL = [
  { votes: 0, value: "No necessary in-game text" },
  {
    votes: 0,
    value: "Some necessary text - easily memorized or small crib sheet",
  },
  {
    votes: 0,
    value: "Moderate in-game text - needs crib sheet or paste ups",
  },
  {
    votes: 0,
    value: "Extensive use of text - massive conversion needed to be playable",
  },
  { votes: 0, value: "Unplayable in another language" },
];

const suggestedPlayersReducer = (
  a: { [key: number]: SuggestedPlayerVotes },
  b: RawSuggestedPlayersPollResult
) => {
  if (b.result === undefined) return a;
  return {
    ...a,
    [b.$.numplayers]: {
      best: b.result[0].numvotes,
      recommended: b.result[1].numvotes,
      notRecommended: b.result[2].numvotes,
    },
  };
};

const suggestedPlayerAgeReducer = (
  a: { [key: number]: number },
  b: RawSuggestedPlayerAgePollResult
) => {
  const key = typeof b.value === "string" ? 21 : b.value;
  return {
    ...a,
    [key]: b.numvotes,
  };
};

const linkReducer =
  (type: LinkType, inbound?: boolean) => (a: LinkInformation[], b: RawLink) => {
    if (b.type !== type) return a;
    if (inbound !== undefined && inbound === (b.inbound === undefined))
      return a;
    return [
      ...a,
      {
        id: b.id,
        value: b.value,
      },
    ];
  };

const languageDependenceReducer = (
  a: LanguageDependenceVotes[],
  b: RawLanguageDependencePollResult
) => {
  return [
    ...a,
    {
      votes: b.numvotes,
      value: b.value,
    },
  ];
};

const versionMapper = (v: RawVersion) => {
  const {
    $: { id },
    thumbnail,
    image,
    name: { value: name },
    productcode: { value: productcode },
    yearpublished: { value: yearpublished },
    width: { value: width },
    length: { value: length },
    depth: { value: depth },
    weight: { value: weight },
  } = v;

  return {
    id,
    name,
    thumbnail,
    image,
    productCode: productcode,
    yearPublished: yearpublished,
    width,
    length,
    depth,
    weight,
  };
};

export const RawItemTransformer = (raw: RawItem): ThingInformation => {
  const {
    $,
    thumbnail,
    image,
    name,
    description,
    yearpublished,
    minplayers,
    maxplayers,
    poll: [suggested_numplayers, suggested_playerage, language_dependence],
    "poll-summary": suggested_numplayers_results,
    playingtime,
    minplaytime,
    maxplaytime,
    minage,
    link,
  } = raw;

  const res: ThingInformation = {
    id: $.id,
    type: $.type,
    name: decodeEntities(
      invariantArray(name).find((n) => n.type === "primary")?.value || ""
    ),
    alternateNames: invariantArray(name)
      .filter((n) => n.type !== "primary")
      .map((n) => decodeEntities(n.value)),
    image,
    thumbnail,
    description: decodeEntities(description),
    yearPublished: yearpublished.value,
    minPlayers: minplayers.value,
    maxPlayers: maxplayers.value,
    playingTime: playingtime.value,
    minPlayTime: minplaytime.value,
    maxPlayTime: maxplaytime.value,
    minAge: minage.value,
    bestWith: (suggested_numplayers_results.result[0].value?.match(/\d\S+/) || [
      "",
    ])[0].replace(/\D+/, "-"),
    recommendedWith: (suggested_numplayers_results.result[1].value.match(
      /\d\S+/
    ) || [""])[0].replace(/\D+/, "-"),
    suggestedNumPlayersPoll: invariantArray(
      suggested_numplayers.results
    ).reduce(suggestedPlayersReducer, {}),
    suggestedPlayerAgePoll:
      suggested_playerage.results?.result.reduce(
        suggestedPlayerAgeReducer,
        {}
      ) || BLANK_PLAYER_AGE_POLL,
    languageDependencePoll:
      language_dependence.results?.result.reduce(
        languageDependenceReducer,
        []
      ) || BLANK_LANGUAGE_DEPENDENCE_POLL,
    categories: link.reduce(linkReducer("boardgamecategory"), []),
    mechanics: link.reduce(linkReducer("boardgamemechanic"), []),
    families: link.reduce(linkReducer("boardgamefamily"), []),
    expands: link.reduce(linkReducer("boardgameexpansion", true), []),
    expansions: link.reduce(linkReducer("boardgameexpansion", false), []),
    accessories: link.reduce(linkReducer("boardgameaccessory"), []),
    reimplements: link.reduce(linkReducer("boardgameimplementation", true), []),
    reimplementedBy: link.reduce(
      linkReducer("boardgameimplementation", false),
      []
    ),
    designers: link.reduce(linkReducer("boardgamedesigner"), []),
    artists: link.reduce(linkReducer("boardgameartist"), []),
    publishers: link.reduce(linkReducer("boardgamepublisher"), []),
  };

  if (raw.statistics !== undefined) {
    const {
      statistics: {
        ratings: {
          usersrated,
          average,
          bayesaverage,
          ranks: { rank },
          owned,
          trading,
          wanting,
          wishing,
          numcomments,
          numweights,
          averageweight,
        },
      },
    } = raw;

    res.statistics = {
      usersRated: usersrated.value,
      averageRating: average.value,
      geekRating: bayesaverage.value,
      ranks: rank
        ? invariantArray(rank).map((r) => ({
            id: r.id,
            category: r.name,
            label: r.friendlyname,
            rank: r.value,
          }))
        : null,
      owned: owned.value,
      trading: trading.value,
      wanting: wanting.value,
      wishing: wishing.value,
      numComments: numcomments.value,
      numWeights: numweights.value,
      weight: averageweight.value,
    };
  }

  if (raw.versions !== undefined) {
    const { item } = raw.versions;
    res.versions = item.map(versionMapper);
  }

  if (raw.videos !== undefined) {
    const {
      $: { total },
      video,
    } = raw.videos;
  }

  return res;
};

export const ThingTransformer = (raw: RawThingResponse): ThingResponse => {
  const {
    items: { $, item },
  } = raw;

  const termsOfUse = $.termsofuse;
  return {
    termsOfUse,
    items: Array.isArray(item)
      ? item.map(RawItemTransformer)
      : [item].map(RawItemTransformer),
  };
};

export const TruncatedThingTransformer = (
  item: ThingInformation
): TruncatedThingInformation => {
  const statistics = invariant(
    item.statistics,
    "Cannot transform item to complete data collection item without statistics object."
  );

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
    id: item.id,
    name: item.name,
    type: item.type,
    image: item.image,
    thumbnail: item.thumbnail,
    yearPublished: item.yearPublished,
    statistics: {
      owned: statistics.owned,
      usersRated: statistics.usersRated,
      averageRating: statistics.averageRating,
      geekRating: statistics.geekRating,
      minPlayers: item.minPlayers,
      maxPlayers: item.maxPlayers,
      minPlayTime: item.minPlayTime,
      maxPlayTime: item.maxPlayTime,
      bestWith: Object.entries(item.suggestedNumPlayersPoll).reduce(
        (a: { pc: number; v: number }, [pc, { best }]) => {
          return a.v > best ? a : { pc: Number(pc), v: best };
        },
        { pc: -1, v: -Infinity }
      ).pc,
      suggestedPlayerAge: Object.entries(item.suggestedPlayerAgePoll).reduce(
        (a: { age: number; v: number }, [age, v]) => {
          return a.v > v ? a : { age: Number(age), v };
        },
        { age: -1, v: -Infinity }
      ).age,
      languageDependence: item.languageDependencePoll.reduce(
        (a: { value: string; votes: number }, b) => {
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
  };
};
