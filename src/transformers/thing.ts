import { log } from "../helpers";
import {
  PlayerCountPollRawResult,
  SuggestedPlayerCountPollResult,
  Thing,
  ThingRaw,
  ThingRawResponse,
  ThingResponse,
} from "../types/thing";

const playerCountPollTransformer = (
  raw: PlayerCountPollRawResult
): SuggestedPlayerCountPollResult => {
  return {
    playerCount: raw.$.numplayers,
    bestVotes: raw.result.find((v) => v.value === "Best")?.numvotes || 0,
    recommendedVotes:
      raw.result.find((v) => v.value === "Recommended")?.numvotes || 0,
    notRecommendedVotes:
      raw.result.find((v) => v.value === "Not Recommended")?.numvotes || 0,
  };
};

const singleThingTransformer = (raw: ThingRaw): Thing => {
  const playerCountPoll = raw.poll?.find(
    (p) => p.$?.name === "suggested_numplayers"
  );
  const playerCountResult: Array<SuggestedPlayerCountPollResult> =
    playerCountPoll?.results
      ? Array.isArray(playerCountPoll.results)
        ? playerCountPoll.results.map(playerCountPollTransformer)
        : [playerCountPollTransformer(playerCountPoll.results)]
      : [];

  return {
    id: "",
    name: "",
    type: raw.$?.type || "boardgame",
    thumbnail: "",
    image: "",
    alternateNames: [],
    description: "",
    yearPublished: -1,
    minPlayers: -1,
    maxPlayers: -1,
    playTime: -1,
    minPlayTime: -1,
    maxPlayTime: -1,
    minAge: -1,
    recommendedPlayerCounts: [],
    bestPlayerCounts: [],
    suggestedPlayerAge: -1,
    weight: -1,
    playerCountPoll: {
      label: "User Suggested number Of Players",
      totalVotes: playerCountPoll?.$?.totalvotes || 0,
      results: [],
      // Array<{
      //   playerCount: -1,
      //   bestVotes: -1,
      //   recommendedVotes: -1,
      //   notRecommendedVotes: -1,
      // }>,
    },
    suggestedPlayerAgePoll: {
      label: "User Suggested Player Age",
      totalVotes: -1,
      results: [],
      // Array<{
      //   age: -1,
      //   votes: -1,
      // }>,
    },
    languageDependencePoll: {
      label: "Language Dependence",
      totalVotes: -1,
      results: [],
      // Array<{
      //   label: "",
      //   level: -1,
      //   votes: -1,
      // }>,
    },
    links: [],
  };
};

export const thingTransformer = (raw: ThingRawResponse): ThingResponse => {
  const {
    items: { $, item },
  } = raw;

  let items: Array<Thing> = [];
  if (Array.isArray(item)) {
    items = item.map(singleThingTransformer);
  } else {
    items = [singleThingTransformer(item)];
  }

  return {
    items,
    termsofuse: $?.termsofuse,
  };
};
