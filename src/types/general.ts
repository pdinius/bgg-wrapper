export type ThingType =
  | "boardgame"
  | "boardgameaccessory"
  | "boardgameexpansion";
export type NameType = "primary" | "alternate";
export type LinkType = "";
export interface IError {
  status: number;
  message: string;
}
