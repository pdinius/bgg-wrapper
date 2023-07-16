"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        // const items = res.items.item.map(v => {
        // })
        console.log(JSON.stringify(res.items.item[0], null, 2));
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
bgg("collection", {
    username: "phildinius",
    stats: true,
});
