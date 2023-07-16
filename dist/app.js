"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bgg = void 0;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const baseUrl = "https://boardgamegeek.com/xmlapi2/";
const getWithTimeout = async (command, params) => {
    const paramsString = Object.entries(params)
        .map(([key, val]) => `${key}=${val}`)
        .join("&");
    let url = baseUrl + command;
    if (paramsString.length)
        url += `?${paramsString}`;
    const execute = async (url) => {
        console.log(url);
        try {
            const response = await axios_1.default.get(url);
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
        }
        catch (e) {
            console.error(e.message);
        }
    };
    const data = await execute(url);
    (0, xml2js_1.parseString)(data, (err, res) => {
        const items = res.items.item.map((v) => ({
            id: Number(v.$.objectid),
            subtype: v.$.subtype,
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
        }));
        console.log(items[0]);
    });
};
const bgg = (c, params) => {
    let resParams = {};
    for (let p in params) {
        if (typeof params[p] === "boolean") {
            resParams[p] = params[p] ? "1" : "0";
        }
        else if (Object.prototype.toString.call(params[p]) === "[object Date]") {
            const d = params[p];
            resParams[p] =
                String(d.getFullYear()).slice(2) +
                    String(d.getMonth()).padStart(2, "0") +
                    String(d.getDate()).padStart(2, "0");
        }
        else {
            resParams[p] = params[p];
        }
    }
    getWithTimeout(c, resParams);
};
exports.bgg = bgg;
(0, exports.bgg)("collection", {
    username: "phildinius",
    stats: true,
});
