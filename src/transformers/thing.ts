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

const getRecommendedOrBest = (
  result: {
    name: "bestwith" | "recommmendedwith";
    value: string;
  }[],
  which: number
) => {
  return (result[which].value?.match(/\d.+(?= players)/) || [""])[0]
    .split(", ")
    .flatMap((s) => {
      s = s.replace(/\D/g, "-");
      if (s.includes("-")) {
        const [a, b] = s.split("-").map((v) => parseInt(v));
        return Array.from({ length: b - a + 1 }, (_, i) => i + a);
      } else {
        return parseInt(s);
      }
    });
};

export const RawItemTransformer = (raw: RawItem): ThingInformation | null => {
  try {
    let {
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

    link = Array.isArray(link) ? link : [link];
    suggested_numplayers_results.result = Array.isArray(
      suggested_numplayers_results.result
    )
      ? suggested_numplayers_results.result
      : [suggested_numplayers_results.result];
    const suggestedPlayers = Array.isArray(suggested_playerage.results?.result)
      ? suggested_playerage.results?.result
      : suggested_playerage.results?.result && [
          suggested_playerage.results?.result,
        ];

    const languageDependencePoll =
      language_dependence.results?.result.reduce(
        languageDependenceReducer,
        []
      ) || BLANK_LANGUAGE_DEPENDENCE_POLL;

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
      bestWith: getRecommendedOrBest(suggested_numplayers_results.result, 0),
      recommendedWith: getRecommendedOrBest(
        suggested_numplayers_results.result,
        1
      ),
      suggestedNumPlayersPoll: invariantArray(
        suggested_numplayers.results
      ).reduce(suggestedPlayersReducer, {}),
      suggestedPlayerAgePoll:
        suggestedPlayers?.reduce(suggestedPlayerAgeReducer, {}) ||
        BLANK_PLAYER_AGE_POLL,
      languageDependence: languageDependencePoll.reduce(
        (a, b) => (a.votes > b.votes ? a : b),
        { value: "", votes: -Infinity }
      ).value,
      languageDependencePoll,
      categories: link.reduce(linkReducer("boardgamecategory"), []),
      mechanics: link.reduce(linkReducer("boardgamemechanic"), []),
      families: link.reduce(linkReducer("boardgamefamily"), []),
      expands: link.reduce(linkReducer("boardgameexpansion", true), []),
      expansions: link.reduce(linkReducer("boardgameexpansion", false), []),
      accessories: link.reduce(linkReducer("boardgameaccessory"), []),
      reimplements: link.reduce(
        linkReducer("boardgameimplementation", true),
        []
      ),
      reimplementedBy: link.reduce(
        linkReducer("boardgameimplementation", false),
        []
      ),
      designers: link.reduce(linkReducer("boardgamedesigner"), []),
      artists: link.reduce(linkReducer("boardgameartist"), []),
      publishers: link.reduce(linkReducer("boardgamepublisher"), []),
      contains: link.reduce(linkReducer("boardgamecompilation", true), []),
      containedIn: link.reduce(linkReducer("boardgamecompilation", false), []),
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
      let { item } = raw.versions;
      item = Array.isArray(item) ? item : [item];
      res.versions = item.map(versionMapper);
    }

    // if (raw.videos !== undefined) {
    //   const {
    //     $: { total },
    //     video,
    //   } = raw.videos;
    // }

    return res;
  } catch (e) {
    console.log(e);
    console.log(
      `Failed to save data for ${raw.$.id} - ${
        Array.isArray(raw.name)
          ? raw.name.find((n) => n.type === "primary")?.value
          : raw.name.value
      }`
    );
    return null;
  }
};

export const ThingTransformer = (raw: RawThingResponse): ThingResponse => {
  const {
    items: { $, item },
  } = raw;

  const termsOfUse = $.termsofuse;
  return {
    termsOfUse,
    items: Array.isArray(item)
      ? item.map(RawItemTransformer).filter((v) => v !== null)
      : [item].map(RawItemTransformer).filter((v) => v !== null),
  };
};
