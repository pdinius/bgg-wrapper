import fs from "node:fs";
import { generateURI, pause } from "./shared/utils";
import { TERMS_OF_USE, XMLAPI, XMLAPI2 } from "./shared/constants";
import {
  RawThingResponse,
  ThingInformation,
  ThingOptions,
  ThingResponse,
} from "./types/thing";
import { ThingTransformer } from "./transformers/thing";
import {
  CollectionOptions,
  CollectionResponse,
  RawCollectionResponse,
} from "./types/collection";
import { CollectionTransformer } from "./transformers/collection";
import { RawUserResponse } from "./types/user";
import { UserTransformer } from "./transformers/user";
import xmlToJson from "@phildinius/xml-to-json";
import { RawSearchResponse, SearchOptions, SearchResult } from "./types/search";
import { searchTransformer } from "./transformers/search";

export {
  CollectionResponse,
  CollectionItemInformation,
  CompleteDataCollectionResponse,
  CompleteDataCollectionItemInformation,
} from "./types/collection";
export { ThingResponse, ThingInformation } from "./types/thing";
export { UserResponse } from "./types/user";

export default class BGG {
  private signal: AbortSignal | undefined;
  private progressEmitter = new EventTarget();
  private authToken: string;

  constructor(props: {
    authToken: string;
    signal?: AbortSignal;
    progressListener?: (items: ThingInformation[]) => void;
    percentListener?: (percent: number) => void;
  }) {
    const { authToken, signal, progressListener, percentListener } = props;
    this.authToken = authToken;
    this.signal = signal;
    if (progressListener) {
      this.progressEmitter.addEventListener(
        "progress",
        (e: CustomEventInit<ThingInformation[]>) => {
          if (e.detail) {
            progressListener(e.detail);
          }
        },
      );
    }
    if (percentListener) {
      this.progressEmitter.addEventListener(
        "percent",
        (e: CustomEventInit<number>) => {
          if (e.detail) {
            percentListener(e.detail);
          }
        },
      );
    }
  }

  private fetchFromBgg = async <T extends object>(uri: string): Promise<T> => {
    const data = await fetch(uri, {
      headers: { Authorization: "Bearer " + this.authToken },
      signal: this.signal,
    });
    const text = await data.text();
    const json: T = xmlToJson(text);

    if (data.status === 200) {
      return json as T;
    } else {
      throw {
        status: data.status,
        message: `Request completed with status ${data.status}.`,
        details:
          data.status === 202
            ? "BGG is fetching your data, retry your request in 5~10 seconds."
            : data.status === 429
              ? "Too many requests. Please wait."
              : undefined,
      };
    }
  };

  async thing(
    id: string | number | Array<string | number>,
    options?: Partial<ThingOptions>,
  ): Promise<ThingResponse> {
    if (Array.isArray(id) && id.length === 0) {
      return {
        termsOfUse: TERMS_OF_USE,
        items: [],
      };
    }
    const chunks: (string | number)[] = [];

    if (Array.isArray(id)) {
      for (let i = 0; i < id.length; i += 20) {
        chunks.push(id.slice(i, i + 20).join(","));
      }
    } else {
      chunks.push(id);
    }

    let ratingcomments = false;
    if (options && "ratings" in options) {
      ratingcomments = true;
    }

    const uris = chunks.map((id) =>
      generateURI(XMLAPI2, "thing", {
        id,
        ratingcomments,
        ...options,
      }),
    );

    const results: ThingResponse = {
      termsOfUse: "",
      items: [],
    };
    for (let i = 0; i < uris.length; ++i) {
      const uri = uris[i];
      try {
        const response = await this.fetchFromBgg<RawThingResponse>(uri);
        const partial = ThingTransformer(response);
        if (!results.termsOfUse) results.termsOfUse = partial.termsOfUse;
        results.items.push(...partial.items);
        this.progressEmitter.dispatchEvent(
          new CustomEvent("progress", {
            detail: partial.items,
          }),
        );
        this.progressEmitter.dispatchEvent(
          new CustomEvent("percent", { detail: i / uris.length }),
        );
        if (i < uris.length - 1) {
          await pause(2);
        }
      } catch (e) {
        console.log(e);
        console.log("pausing for 5 seconds");
        await pause(10);
        --i;
        continue;
      }
    }
    this.progressEmitter.dispatchEvent(
      new CustomEvent("percent", { detail: 1 }),
    );
    return results;
  }

  async collection(
    username: string,
    options?: Partial<CollectionOptions>,
  ): Promise<CollectionResponse> {
    const uri = generateURI(XMLAPI2, "collection", {
      username,
      ...options,
    });

    try {
      const response = await this.fetchFromBgg<RawCollectionResponse>(uri);
      return CollectionTransformer(response);
    } catch (e) {
      await pause(10);
      return this.collection(username, options);
    }
  }

  async user(username: string) {
    const uri = generateURI(XMLAPI2, "user", { name: username });
    const response = await this.fetchFromBgg<RawUserResponse>(uri);
    return UserTransformer(response);
  }

  async search(query: string, options?: Partial<SearchOptions>) {
    const uri = generateURI(XMLAPI2, "search", { query, ...options });
    const response = await this.fetchFromBgg<RawSearchResponse>(uri);
    return searchTransformer(response);
  }
}

const bgg = new BGG({ authToken: "29b96081-6360-4c07-8573-a2e3b5940b29" });

const gamenames = [
  "Ark Nova",
  "Lost Ruins of Arnak",
  "Wingspan",
  "Scythe",
  "Viticulture",
  "Dune: Imperium",
  "Everdell",
  "Heat: Pedal to the Metal",
  "Spirit Island",
  "The Castles of Burgundy",
  "SETI: Search for Extraterrestrial Intelligence",
  "Brass: Birmingham",
  "Earth",
  "Cascadia",
  "Concordia",
  "Space Base",
  "Quacks",
  "A Feast for Odin",
  "Gloomhaven",
  "Cthulhu: Death May Die",
  "Root",
  "Dune: Imperium – Uprising",
  "Ticket to Ride",
  "Marvel United",
  "Obsession",
  "Galactic Cruise",
  "Sky Team",
  "Pandemic",
  // "Ra",
  "Clank!: Catacombs",
  "The Crew: Mission Deep Sea",
  "Five Tribes: The Djinns of Naqala", // ***
  "Orléans", // ***
  "Paladins of the West Kingdom",
  "Carcassonne",
  "7 Wonders Duel",
  "Blood Rage",
  "Marvel Champions: The Card Game",
  "The Quest for El Dorado",
  "The Lord of the Rings: Duel for Middle-earth",
  "Slay the Spire: The Board Game",
  "Final Girl",
  "Forest Shuffle",
  "Pandemic Legacy: Season 1",
  "Underwater Cities",
  "Grand Austria Hotel",
  "Arkham Horror (Third Edition)",
  "Star Wars: Rebellion",
  "The White Castle",
  "Meadow",
  "Lords of Waterdeep",
  "Raiders of the North Sea",
  "Bomb Busters",
  "Just One",
  "Dominion",
  "Great Western Trail",
  "Anachrony",
  "Planet Unknown",
  "Harmonies",
  "Endeavor: Deep Sea",
  "Distilled",
  "Twilight Imperium: Fourth Edition",
  "The Lord of the Rings: Fate of the Fellowship",
  "Thunder Road: Vendetta",
  "Deliverance",
  "Hegemony: Lead Your Class to Victory",
  "Rising Sun",
  "Cosmic Encounter",
  "Aeon's End",
  "Andromeda's Edge",
  "Revive",
  "Nemesis",
  "Mansions of Madness: Second Edition",
  "Beyond the Sun",
  "Arcs",
  "Frosthaven",
  "The Fellowship of the Ring",
  "Eclipse",
  "Tapestry",
  "Agricola",
  "Sleeping Gods",
  "Power Grid",
  "Caverna: The Cave Farmers",
  "Hansa Teutonica",
  "7 Wonders",
  "The Lord of the Rings: The Card Game",
  "Azul",
  "Race for the Galaxy",
  "Deception: Murder in Hong Kong",
  "Architects of the West Kingdom",
  "Life of the Amazonia",
  "Codenames",
  "Castles of Mad King Ludwig",
  "Gaia Project",
  "Through the Ages: A New Story of Civilization",
  "War of the Ring",
  "The Vale of Eternity",
  "Blood on the Clocktower",
  "Vantage",
];

const fn = async () => {
  const progress = JSON.parse(fs.readFileSync("./dice-tower-top-100.json", "utf-8")) as SearchResult[];

  for (let i = 0; i < gamenames.length; ++i) {
    const name = gamenames[i];
    if (progress.some(v => v.name.toLowerCase() === name)) {
      console.log(`Skipping ${name} ...`);
      continue;
    }
    try {
      const res = await bgg.search(name, { exact: true });
      progress.push(res.items[0]);
      console.log(`Found id: ${res.items[0].id}`);
      if (res.items[0].yearPublished === 2014) {
        console.log(res.items[0].name);
      }
      fs.writeFileSync("dice-tower-top-100.json", JSON.stringify(progress, null, 2));
      await pause(0.5);
    } catch (e) {
      await pause(5);
      --i;
    }
  }

  console.log("complete");
}

fn();