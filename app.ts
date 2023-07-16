import axios, { AxiosResponse } from "axios";
import { parseString } from "xml2js";
import { BGGItem, RawCollection, SubType } from "./types";

interface CommandParams {
  collection: {
    username: string;
    version?: number;
    subtype?: SubType;
    excludesubtype?: SubType;
    id?: string | Array<string>;
    brief?: boolean;
    stats?: boolean;
    own?: boolean;
    rated?: boolean;
    played?: boolean;
    comment?: boolean;
    trade?: boolean;
    want?: boolean;
    wishlist?: boolean;
    wishlistpriority?: number; // 1 - 5
    preordered?: boolean;
    wanttoplay?: boolean;
    wanttobuy?: boolean;
    prevowned?: boolean;
    hasparts?: boolean;
    wantparts?: boolean;
    minrating?: number; // 1 - 10
    rating?: number; // 1 - 10
    minbggrating?: number; // 1 - 10
    bggrating?: number; // 1 - 10
    minplays?: number;
    maxplays?: number;
    showprivate?: boolean;
    modifiedsince?: Date;
  };
}

const baseUrl = "https://boardgamegeek.com/xmlapi2/";
const getWithTimeout = async (
  command: string,
  params: { [key: string]: string | number }
) => {
  const paramsString = Object.entries(params)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
  let url = baseUrl + command;
  if (paramsString.length) url += `?${paramsString}`;

  const execute = async (url: string) => {
    console.log(url);
    try {
      const response: AxiosResponse = await axios.get(url);
      console.log(response.status);
      if (response.status === 202) {
        await new Promise((res, rej) => {
          setTimeout(res, 3000);
        });
      }
      if (response.status >= 400) {
        // handle error
      }
      return response.data;
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const data = await execute(url);
  parseString(data, (err, res) => {
    const items = res.items.item.map(
      (v: RawCollection): BGGItem => ({
        id: Number(v.$.objectid),
        subtype: v.$.subtype as SubType,
        name: v.name[0]._,
        year_published: Number(v.yearpublished),
        image_url: v.image[0],
        thumbnail_url: v.thumbnail[0],
        stats: {
          min_players: Number(v.stats[0].$.minplayers),
          max_players: Number(v.stats[0].$.maxplayers),
          min_playtime: Number(v.stats[0].$.minplaytime),
          max_playtime: Number(v.stats[0].$.maxplaytime),
        },
        rating: Number(v.stats[0].rating[0].$.value),
        num_users_rated: Number(v.stats[0].rating[0].usersrated[0].$.value),
        avg_user_rating: Number(v.stats[0].rating[0].average[0].$.value),
        geek_rating: Number(v.stats[0].rating[0].bayesaverage[0].$.value),
        ranks: v.stats[0].rating[0].ranks[0].rank.map(r => ({
          type: r.$.type,
          id: Number(r.$.id),
          name: r.$.name,
          label: r.$.friendlyname,
          rank: Number(r.$.value),
          avg_rating: Number(r.$.bayesaverage),
        })),
        status: {
          own: v.status[0].$.own === '1',
          prev_owned: v.status[0].$.prevowned === '1',
          for_trade: v.status[0].$.fortrade === '1',
          want: v.status[0].$.want === '1',
          want_to_play: v.status[0].$.wanttoplay === '1',
          want_to_buy: v.status[0].$.wanttobuy === '1',
          wishlist: v.status[0].$.wishlist === '1',
          preordered: v.status[0].$.preordered === '1',
          last_modified: new Date(v.status[0].$.lastmodified),
        },
        num_plays: Number(v.numplays),
      })
    );
    console.log(items[0]);
  });
};

export const bgg = <Command extends keyof CommandParams>(
  c: Command,
  params: CommandParams[Command]
) => {
  let resParams: { [key: string]: string | number } = {};

  for (let p in params) {
    if (typeof params[p] === "boolean") {
      resParams[p] = params[p] ? "1" : "0";
    } else if (Object.prototype.toString.call(params[p]) === "[object Date]") {
      const d: Date = params[p] as Date;
      resParams[p] =
        String(d.getFullYear()).slice(2) +
        String(d.getMonth()).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0");
    } else {
      resParams[p] = params[p] as any;
    }
  }

  getWithTimeout(c, resParams);
};

bgg("collection", {
  username: "phildinius",
  stats: true,
});
