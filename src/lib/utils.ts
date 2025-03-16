import { AlternateResult } from "../types/general";

export const generateURI = (
  base: string,
  route: string,
  options?: { [key: string]: boolean | string | number }
) => {
  const params = [];

  if (options) {
    for (const [k, v] of Object.entries(options)) {
      if (typeof v === "string") {
        params.push(`${k}=${encodeURI(v)}`);
      } else if (typeof v === "boolean") {
        params.push(`${k}=${v ? 1 : 0}`);
      } else {
        params.push(`${k}=${v}`);
      }
    }
  }

  const paramString = params.length ? `?${params.join("&")}` : "";
  return base + route + paramString;
};

export const pause = (seconds: number) => {
  return new Promise((res) => setTimeout(res, seconds * 1000));
};

export const cleanString = (s: string) => {
  return s.trim().replace(/\s+/g, " ");
};

export const invariantArray = <T>(v: T | Array<T>): Array<T> => {
  return [v].flat() as Array<T>;
};

export const invariant = <T>(el: T | null | undefined, msg: string): T => {
  if (!el) throw Error(msg);
  return el;
}