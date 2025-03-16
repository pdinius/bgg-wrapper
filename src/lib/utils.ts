export const log = (o: any) => {
  console.log(JSON.stringify(o, null, 2));
};

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

export const clean = <T extends Object>(o: T) => {
  if (typeof o !== "object") return o;

  for (const [k, v] of Object.entries(o)) {
    const key = k as keyof typeof o;
    if (v === undefined) {
      delete o[key];
    }
  }

  return o as T;
};

export type OrArray<T> = Array<T> | T;

export const dateToString = (d: Date) => {
  const YY = d.getFullYear().toString().slice(2);
  const MM = (d.getMonth() + 1).toString().padStart(2, "0");
  const DD = d.getDate().toString().padStart(2, "0");
  const HH = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const SS = d.getSeconds().toString().padStart(2, "0");
  return `${YY}-${MM}-${DD}%20${HH}:${mm}:${SS}`;
};

export const partition = <T>(arr: Array<T>, size: number) => {
  const res: Array<Array<T>> = [];

  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }

  return res;
};

export const cleanString = (s: string) => {
  return s.trim().replace(/\s+/g, " ");
}