export type ThingType =
  | "boardgame"
  | "boardgameaccessory"
  | "boardgameexpansion"
  | "boardgameversion";
export type NameType = "primary" | "alternate";
export interface IError {
  status: number;
  message: string;
}
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
  | "boardgamepublisher";

export interface AlternateResult {
  status: number;
  message: string;
}

export type AlternateResponse =
  | {
      message: string;
    }
  | {
      errors: { error: { message: string } };
    };
