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
} from "../types/thing";

const suggestedPlayersReducer = (
  a: { [key: number]: SuggestedPlayerVotes },
  b: RawSuggestedPlayersPollResult
) => {
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
    name: name.find((n) => n.type === "primary")?.value || "",
    alternateNames: name
      .filter((n) => n.type !== "primary")
      .map((n) => n.value),
    image,
    thumbnail,
    description,
    yearPublished: yearpublished.value,
    minPlayers: minplayers.value,
    maxPlayers: maxplayers.value,
    playingTime: playingtime.value,
    minPlayTime: minplaytime.value,
    maxPlayTime: maxplaytime.value,
    minAge: minage.value,
    bestWith: (suggested_numplayers_results.result[0].value.match(/\d\S+/) ||
      "")[0].replace(/\D+/, "-"),
    recommendedWith: (suggested_numplayers_results.result[1].value.match(
      /\d\S+/
    ) || "")[0].replace(/\D+/, "-"),
    suggestedNumPlayersPoll: suggested_numplayers.results.reduce(
      suggestedPlayersReducer,
      {}
    ),
    suggestedPlayerAgePoll: suggested_playerage.results.result.reduce(
      suggestedPlayerAgeReducer,
      {}
    ),
    languageDependencePoll: language_dependence.results.result.reduce(
      languageDependenceReducer,
      []
    ),
    categories: link.reduce(linkReducer("boardgamecategory"), []),
    mechanics: link.reduce(linkReducer("boardgamemechanic"), []),
    families: link.reduce(linkReducer("boardgamefamily"), []),
    expansions: link.reduce(linkReducer("boardgameexpansion"), []),
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
      ranks: rank.map((r) => ({
        id: r.id,
        category: r.name,
        label: r.friendlyname,
        rank: r.value,
      })),
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

export const ThingTransformer = (raw: RawThingResponse) => {
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
