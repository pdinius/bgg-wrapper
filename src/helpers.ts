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
