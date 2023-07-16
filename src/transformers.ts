import {
  BggThing,
  Collection,
  CollectionItem,
  RawCollection,
  RawThing,
  SubType,
} from "./types";

export const transformRawCollectionToCollection = (
  c: RawCollection
): Collection => {
  const items = c.items.item.map((v) => {
    const res: CollectionItem = {
      id: Number(v.$.objectid),
      subtype: v.$.subtype as SubType,
      name: v.name[0]._,
      year_published: Number(v.yearpublished),
      image_url: v.image[0],
      thumbnail_url: v.thumbnail[0],
      status: {
        own: v.status[0].$.own === "1",
        prev_owned: v.status[0].$.prevowned === "1",
        for_trade: v.status[0].$.fortrade === "1",
        want: v.status[0].$.want === "1",
        want_to_play: v.status[0].$.wanttoplay === "1",
        want_to_buy: v.status[0].$.wanttobuy === "1",
        wishlist: v.status[0].$.wishlist === "1",
        preordered: v.status[0].$.preordered === "1",
        last_modified: new Date(v.status[0].$.lastmodified),
      },
      num_plays: Number(v.numplays),
    };

    if (v.stats) {
      res.rating = Number(v.stats[0].rating[0].$.value);
      res.num_users_rated = Number(v.stats[0].rating[0].usersrated[0].$.value);
      res.avg_user_rating = Number(v.stats[0].rating[0].average[0].$.value);
      res.geek_rating = Number(v.stats[0].rating[0].bayesaverage[0].$.value);
      res.ranks = v.stats[0].rating[0].ranks[0].rank.map((r) => ({
        type: r.$.type,
        id: Number(r.$.id),
        name: r.$.name,
        label: r.$.friendlyname,
        rank: Number(r.$.value),
        avg_rating: Number(r.$.bayesaverage),
      }));
      res.stats = {
        min_players: Number(v.stats[0].$.minplayers),
        max_players: Number(v.stats[0].$.maxplayers),
        min_playtime: Number(v.stats[0].$.minplaytime),
        max_playtime: Number(v.stats[0].$.maxplaytime),
      }
    }

    return res;
  });
  return {
    total_items: Number(c.items.$.totalitems),
    retrieved_date: new Date(c.items.$.pubdate),
    items
  };
};

export const transformRawThingToBggThing = (v: RawThing): Array<BggThing> => {
  const items = v.items.item;
  return items.map((item) => {
    const res: BggThing = {
      name: item.name.find((n) => n.$.type === "primary")!.$.value,
      id: Number(item.$.id),
      type: item.$.type,
      image_url: item.image[0],
      thumbnail_url: item.thumbnail[0],
      alternate_names: item.name
        .filter((n) => n.$.type === "alternate")
        .map((n) => n.$.value),
      description: item.description[0],
      year_published: Number(item.yearpublished[0].$.value),
      min_players: Number(item.minplayers[0].$.value),
      max_players: Number(item.maxplayers[0].$.value),
      min_playtime: Number(item.minplaytime[0].$.value),
      max_playtime: Number(item.maxplaytime[0].$.value),
      min_age: Number(item.minage[0].$.value),
      related_items: item.link.map(({ $ }) => ({
        name: $.value,
        id: Number($.id),
        type: $.type,
      })),
      polls: item.poll.map(({ $, results }) => ({
        name: $.name,
        label: $.title,
        total_votes: Number($.totalvotes),
        results:
          results.length === 1
            ? results[0].result.map(({ $: { level, value, numvotes } }) => {
                let option = value;
                if (level) {
                  option = `${level} - ${option}`;
                }
                return {
                  option,
                  num_votes: Number(numvotes),
                };
              })
            : results.flatMap(({ $, result }) => {
                const res = result.map(({ $ }) => ({
                  option: $.value,
                  num_votes: Number($.numvotes),
                }));
                if ($) {
                  const [key, value] = Object.entries($)[0];
                  for (let r of res) {
                    r.option = `${key}: ${value} - ${r.option}`;
                  }
                }
                return res;
              }),
      })),
    };

    if (item.statistics) {
      const s = item.statistics[0].ratings[0];
      res.stats = {
        num_ratings: Number(s.usersrated[0].$.value),
        rating: Number(s.average[0].$.value),
        geek_rating: Number(s.bayesaverage[0].$.value),
        ranks: s.ranks[0].rank.map(({ $ }) => {
          return {
            type: $.type,
            id: Number($.id),
            label: $.friendlyname,
            rank: Number($.value),
          };
        }),
        num_owners: Number(s.owned[0].$.value),
        num_trading: Number(s.trading[0].$.value),
        num_wanting: Number(s.wanting[0].$.value),
        num_wishing: Number(s.wishing[0].$.value),
        num_comments: Number(s.numcomments[0].$.value),
        num_weights: Number(s.numweights[0].$.value),
        avg_weight: Number(s.averageweight[0].$.value),
      };
    }

    return res;
  });
};
