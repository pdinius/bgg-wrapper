import axios, { AxiosResponse } from "axios";
import { parseString } from 'xml2js';

type SubType = "boardgame" | "boardgameexpansion" | "boardgameaccessory";
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
    // const items = res.items.item.map(v => {

    // })
    console.log(JSON.stringify(res.items.item[0], null, 2));
  })
};

const bgg = <Command extends keyof CommandParams>(
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
