import { log } from "../helpers";
import {
  LANGUAGE_DEPENDENCE_LABELS,
  LanguageDependencePollRaw,
  LanguageDependencePollResult,
  LanguageDependencePollResultRaw,
  Link,
  LinkRaw,
  PlayerCountPollRaw,
  PlayerCountPollResultRaw,
  Stats,
  SuggestedPlayerAgePollRaw,
  SuggestedPlayerAgePollResult,
  SuggestedPlayerAgePollResultRaw,
  SuggestedPlayerCountPollResult,
  Thing,
  ThingRaw,
  ThingRawResponse,
  ThingResponse,
} from "../types/thing";

const playerCountPollTransformer = (
  raw: PlayerCountPollResultRaw
): SuggestedPlayerCountPollResult => {
  return {
    playerCount: raw.$.numplayers,
    best: raw.result.find((v) => v.value === "Best")?.numvotes || 0,
    recommended:
      raw.result.find((v) => v.value === "Recommended")?.numvotes || 0,
    notRecommended:
      raw.result.find((v) => v.value === "Not Recommended")?.numvotes || 0,
  };
};

const playerAgePollTransformer = (
  raw: SuggestedPlayerAgePollResultRaw
): SuggestedPlayerAgePollResult => {
  const age = parseInt(String(raw.value));

  if (isNaN(age)) {
    throw Error(`Could not find age in string: ${raw.value}.`);
  }

  return {
    age,
    numVotes: raw.numvotes,
  };
};

const languagePollTransformer = (
  raw: LanguageDependencePollResultRaw
): LanguageDependencePollResult => {
  const label = LANGUAGE_DEPENDENCE_LABELS.find((v) => v === raw.value);
  const level =
    LANGUAGE_DEPENDENCE_LABELS.findIndex((v) => v === raw.value) + 1;

  if (label === undefined || level === 0) {
    throw Error(
      `Unable to find language dependence label for item: ${JSON.stringify(
        raw
      )}`
    );
  }

  return {
    level,
    label,
    numVotes: raw.numvotes,
  };
};

const LinkTransformer = (raw: LinkRaw): Link => {
  return {
    type: raw.type,
    id: String(raw.id),
    name: raw.value,
  };
};

const singleThingTransformer = (raw: ThingRaw): Thing => {
  const playerCountPoll = raw.poll?.find(
    (p) => p.$?.name === "suggested_numplayers"
  ) as PlayerCountPollRaw;
  const playerAgePoll = raw.poll?.find(
    (p) => p.$?.name === "suggested_playerage"
  ) as SuggestedPlayerAgePollRaw;
  const languagePoll = raw.poll?.find(
    (p) => p.$?.name === "language_dependence"
  ) as LanguageDependencePollRaw;

  const playerCountResult: Array<SuggestedPlayerCountPollResult> =
    Array.isArray(playerCountPoll.results)
      ? playerCountPoll.results.map(playerCountPollTransformer)
      : [playerCountPollTransformer(playerCountPoll.results)];
  const playerAgeResult: Array<SuggestedPlayerAgePollResult> = Array.isArray(
    playerAgePoll.results.result
  )
    ? playerAgePoll.results.result.map(playerAgePollTransformer)
    : [playerAgePollTransformer(playerAgePoll.results.result)];
  const languageResult: Array<LanguageDependencePollResult> =
    languagePoll.results.result.map(languagePollTransformer);

  let links: Array<Link> = [];
  if (Array.isArray(raw.link)) {
    links = raw.link.map(LinkTransformer);
  } else if (raw.link !== undefined) {
    links = [LinkTransformer(raw.link)];
  }

  let stats: Stats | undefined = undefined;
  let page: number | undefined = undefined;

  if (raw.statistics) {
    const { statistics: { $, ratings } } = raw;
    stats = {
      rank: ratings.ranks.rank.find((r) => r.id === 1)?.value || -1,
      familyRanks: ratings.ranks.rank
        .filter((r) => r.id > 1)
        .map((r) => {
          return {
            id: String(r.id),
            name: r.name,
            label: r.friendlyname,
            rank: r.value,
            bayesAverage: r.bayesaverage,
          };
        }),
      avgRating: ratings.average.value,
      bayesAverage: ratings.bayesaverage.value,
      stdDev: ratings.stddev.value,
      median: ratings.median.value,
      weight: ratings.averageweight.value,
      users: {
        rated: ratings.usersrated.value,
        owned: ratings.owned.value,
        forTrade: ratings.trading.value,
        wantInTrade: ratings.wanting.value,
        wishlist: ratings.wishing.value,
        commented: ratings.numcomments.value,
        weightVote: ratings.numweights.value
      }
    };
  }

  return {
    id: String(raw.$?.id),
    name: Array.isArray(raw.name)
      ? raw.name.find((v) => v.type === "primary")!.value
      : raw.name!.value,
    type: raw.$?.type || "boardgame",
    thumbnail: raw.thumbnail,
    image: raw.image,
    alternateNames: Array.isArray(raw.name)
      ? raw.name.filter((v) => v.type === "alternate").map((v) => v.value)
      : [],
    description: raw.description,
    yearPublished: Number(raw.yearpublished?.value) || -1,
    minPlayers: raw.minplayers?.value || -1,
    maxPlayers: raw.maxplayers?.value || -1,
    playTime: raw.playingtime?.value || -1,
    minPlayTime: raw.minplaytime?.value || -1,
    maxPlayTime: raw.maxplaytime?.value || -1,
    minAge: raw.minage?.value || -1,
    recommendedPlayerCounts: playerCountResult
      .filter((v) => {
        const max = Math.max(v.best, v.recommended, v.notRecommended);
        return v.best === max || v.recommended === max;
      })
      .map((v) => v.playerCount),
    bestPlayerCounts: playerCountResult
      .filter((v) => {
        const max = Math.max(v.best, v.recommended, v.notRecommended);
        return v.best === max;
      })
      .map((v) => v.playerCount),
    suggestedPlayerAge: playerAgeResult.sort(
      (a, b) => b.numVotes - a.numVotes || a.age - b.age
    )[0].age,
    playerCountPoll: {
      label: "User Suggested number Of Players",
      totalVotes: playerCountPoll?.$?.totalvotes || 0,
      results: playerCountResult,
    },
    suggestedPlayerAgePoll: {
      label: "User Suggested Player Age",
      totalVotes: playerAgePoll?.$?.totalvotes || 0,
      results: playerAgeResult,
    },
    languageDependencePoll: {
      label: "Language Dependence",
      totalVotes: languagePoll?.$?.totalvotes || 0,
      results: languageResult,
    },
    links,
    stats,
    page,
  };
};

export const thingTransformer = (raw: ThingRawResponse): ThingResponse => {
  log(raw);
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
