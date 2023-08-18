import {
  Collection,
  CollectionItem,
  RawCollection,
  RawThing,
  Thing,
  RawItem,
  PollResult,
  RawPlays,
  Plays,
  Play,
  SubType,
  RawSearch,
  Search,
} from "./types/types";
import { findFirst } from "./utils";

export const transformRawCollectionToCollection = (
  c: RawCollection
): Collection => {
  const items = c.items.item.map((v) => {
    const res: CollectionItem = {
      id: Number(v.$.objectid),
      subtype: v.$.subtype,
      name: v.name._v,
      year_published: Number(v.yearpublished),
      image_url: v.image,
      thumbnail_url: v.thumbnail,
      status: {
        own: v.status.own === "1",
        prev_owned: v.status.prevowned === "1",
        for_trade: v.status.fortrade === "1",
        want: v.status.want === "1",
        want_to_play: v.status.wanttoplay === "1",
        want_to_buy: v.status.wanttobuy === "1",
        wishlist: v.status.wishlist === "1",
        preordered: v.status.preordered === "1",
        last_modified: new Date(v.status.lastmodified),
      },
      num_plays: Number(v.numplays),
    };

    if (v.stats) {
      res.rating = Number(v.stats.rating.$.value);
      res.num_users_rated = Number(v.stats.rating.usersrated.value);
      res.avg_user_rating = Number(v.stats.rating.average.value);
      res.geek_rating = Number(v.stats.rating.bayesaverage.value);
      res.ranks = Array.isArray(v.stats.rating.ranks.rank)
        ? v.stats.rating.ranks.rank.map((r) => ({
            type: r.type,
            id: Number(r.id),
            name: r.name,
            label: r.friendlyname,
            rank: Number(r.value),
            avg_rating: Number(r.bayesaverage),
          }))
        : [
            {
              type: v.stats.rating.ranks.rank.type,
              id: Number(v.stats.rating.ranks.rank.id),
              name: v.stats.rating.ranks.rank.name,
              label: v.stats.rating.ranks.rank.friendlyname,
              rank: Number(v.stats.rating.ranks.rank.value),
              avg_rating: Number(v.stats.rating.ranks.rank.bayesaverage),
            },
          ];
      res.stats = {
        min_players: Number(v.stats.$.minplayers),
        max_players: Number(v.stats.$.maxplayers),
        min_playtime: Number(v.stats.$.minplaytime),
        max_playtime: Number(v.stats.$.maxplaytime),
      };
    }

    return res;
  });
  return {
    total_items: Number(c.items.$.totalitems),
    retrieved_date: new Date(c.items.$.pubdate),
    items,
  };
};

export const transformRawThingToThing = (v: RawThing): Array<Thing> => {
  const items: RawItem[] = Array.isArray(v.items.item)
    ? v.items.item
    : [v.items.item];

  return items.map((item) => {
    const res: Thing = {
      name: Array.isArray(item.name)
        ? item.name?.find((n) => n.type === "primary")!.value
        : item.name.value,
      id: Number(item.$.id),
      type: item.$.type,
      image_url: item.image,
      thumbnail_url: item.thumbnail,
      alternate_names: Array.isArray(item.name)
        ? item.name.filter((n) => n.type === "alternate").map((n) => n.value)
        : [],
      description: item.description,
      year_published: item.yearpublished
        ? Number(item.yearpublished.value)
        : -1,
      min_players: item.minplayers ? Number(item.minplayers.value) : -1,
      max_players: item.maxplayers ? Number(item.maxplayers.value) : -1,
      min_playtime: item.minplaytime ? Number(item.minplaytime.value) : -1,
      max_playtime: item.maxplaytime ? Number(item.maxplaytime.value) : -1,
      min_age: item.minage ? Number(item.minage.value) : -1,
      related_items: item.link.map(({ type, id, value }) => ({
        name: value,
        id: Number(id),
        type,
      })),
      polls: item.poll
        ? item.poll.map(({ $, results }) => {
            let res: Array<PollResult> = [];

            if (Array.isArray(results)) {
              res = res.concat(
                ...results.map(({ $, result }) => {
                  return result.map((r) => ({
                    option: `${r.value} with ${$.numplayers} player${
                      $.numplayers === "1" ? "" : "s"
                    }`,
                    num_votes: Number(r.numvotes),
                  }));
                })
              );
            } else {
              for (let r of results.result) {
                if ("level" in r) {
                  res.push({
                    option: `${r.level} - ${r.value}`,
                    num_votes: Number(r.numvotes),
                  });
                } else {
                  res.push({
                    option: r.value,
                    num_votes: Number(r.numvotes),
                  });
                }
              }
            }

            return {
              name: $.name,
              label: $.title,
              total_votes: Number($.totalvotes),
              results: res,
            };
          })
        : [],
    };

    if (item.statistics) {
      const s = item.statistics.ratings;
      res.stats = {
        num_ratings: Number(s.usersrated.value),
        rating: Number(s.average.value),
        geek_rating: Number(s.bayesaverage.value),
        ranks: Array.isArray(s.ranks.rank)
          ? s.ranks.rank.map(({ type, id, friendlyname, value }) => {
              return {
                type: type,
                id: Number(id),
                label: friendlyname,
                rank: Number(value),
              };
            })
          : [
              {
                type: s.ranks.rank.type,
                id: Number(s.ranks.rank.id),
                label: s.ranks.rank.friendlyname,
                rank: Number(s.ranks.rank.value),
              },
            ],
        num_owners: Number(s.owned.value),
        num_trading: Number(s.trading.value),
        num_wanting: Number(s.wanting.value),
        num_wishing: Number(s.wishing.value),
        num_comments: Number(s.numcomments.value),
        num_weights: Number(s.numweights.value),
        avg_weight: Number(s.averageweight.value),
      };
    }

    return res;
  });
};

export const transformRawPlaysToPlays = (p: RawPlays): Plays => {
  return {
    username: p.plays.$.username,
    user_id: Number(p.plays.$.userid),
    total_plays: Number(p.plays.$.total),
    page: Number(p.plays.$.page),
    plays: p.plays.play.map((el) => {
      type subTypeValue = {
        value: SubType;
      };
      let subTypes: subTypeValue | Array<subTypeValue> =
        el.item.subtypes.subtype;
      let subTypesArr: Array<subTypeValue>;
      const subTypeList: Array<SubType> = [
        "boardgame",
        "boardgameexpansion",
        "boardgameaccessory",
      ];
      if (!Array.isArray(subTypes)) {
        subTypesArr = [subTypes];
      } else {
        subTypesArr = subTypes;
      }
      const res: Play = {
        id: Number(el.$.id),
        date: new Date(el.$.date),
        quantity: Number(el.$.quantity),
        length: Number(el.$.length),
        incomplete: el.$.incomplete === "1",
        now_in_stats: el.$.incomplete === "1",
        game: {
          name: el.item.$.name,
          id: Number(el.item.$.objectid),
          subtype:
            findFirst(subTypesArr, subTypeList, (el) => el.value) ||
            "boardgame",
        },
      };
      if (el.$.location) {
        res.location = el.$.location;
      }
      return res;
    }),
  };
};

export const transformRawSearchToSearch = (s: RawSearch): Search => {
  if ("item" in s.items) {
    const res = Array.isArray(s.items.item)
      ? s.items.item.filter((item) => {
          return (
            (item.$.type === "boardgame" ||
              item.$.type === "boardgameexpansion") &&
            item.name.type === "primary"
          );
        })
      : [s.items.item];

    return res.map((item) => ({
      id: item.$.id,
      name: item.name.value,
      year_published: item.yearpublished?.value,
    }));
  } else {
    return [];
  }
};
