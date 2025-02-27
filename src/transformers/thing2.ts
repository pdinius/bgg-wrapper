import { LinkType } from "../types/general";
import {
  LanguageDependenceVotes,
  LinkInformation,
  RawItem,
  RawLanguageDependencePollResult,
  RawLink,
  RawSuggestedPlayerAgePollResult,
  RawSuggestedPlayersPollResult,
  RawThingResponse,
  SuggestedPlayerVotes,
} from "../types/thing2";

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

export const RawItemTransformer = (raw: RawItem) => {
  const {
    $,
    thumbnail,
    image,
    name,
    description,
    yearpublished,
    minplayers,
    maxplayers,
    poll: [
      suggested_numplayers,
      suggested_numplayers_results,
      suggested_playerage,
      language_dependence,
    ],
    playingtime,
    minplaytime,
    maxplaytime,
    minage,
    link,
  } = raw;

  return {
    id: $.id.toString(),
    name: name.find((n) => n.type === "primary")?.value,
    alternameNames: name
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
    bestWith: suggested_numplayers_results.result[0].value.replace(/ΓÇô/g, "-"),
    recommendedWith: (suggested_numplayers_results.result[1].value.match(
      /\d\S+/
    ) || "")[0].replace(/\D+/, "-"),
    suggestedNumPlayers: suggested_numplayers.results.reduce(
      suggestedPlayersReducer,
      {}
    ),
    suggestedPlayerAge: suggested_playerage.results.result.reduce(
      suggestedPlayerAgeReducer,
      {}
    ),
    languageDependence: language_dependence.results.result.reduce(
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
