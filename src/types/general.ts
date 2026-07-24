const THING_TYPE = [
  "boardgame",
  "boardgameaccessory",
  "boardgameexpansion",
  "boardgameversion",
] as const;

export const isThingType = (s: string): s is ThingType => {
  return THING_TYPE.includes(s as ThingType);
};

export type ThingType = (typeof THING_TYPE)[number];
export type NameType = "primary" | "alternate";
export type LanguageDependenceLevel =
  | "No necessary in-game text"
  | "Some necessary text - easily memorized or small crib sheet"
  | "Moderate in-game text - needs crib sheet or paste ups"
  | "Extensive use of text - massive conversion needed to be playable"
  | "Unplayable in another language";
export type LinkType =
  | "boardgamecategory"
  | "boardgamemechanic"
  | "boardgamefamily"
  | "boardgameexpansion"
  | "boardgameaccessory"
  | "boardgameimplementation"
  | "boardgamedesigner"
  | "boardgameartist"
  | "boardgamepublisher"
  | "boardgamecompilation"
  | "boardgameversion"
  | "language";

