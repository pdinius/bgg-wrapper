export const generateURI = (
  base: string,
  route: string,
  options?: { [key: string]: boolean | string | number | undefined },
) => {
  const params = [];

  if (options) {
    for (const [k, v] of Object.entries(options)) {
      if (v === undefined) continue;
      if (typeof v === "string") {
        params.push(`${k}=${encodeURIComponent(v)}`);
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

export const pause = (seconds: number, signal?: AbortSignal) => {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError(signal));
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, seconds * 1000);

    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError(signal));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
};

const abortError = (signal?: AbortSignal) => {
  if (signal?.reason instanceof Error) return signal.reason;
  const error = new Error("This operation was aborted");
  error.name = "AbortError";
  return error;
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
};

export const decodeEntities = (encodedString: string) => {
  if (typeof encodedString !== "string") return encodedString;
  const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  const translate = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    lt: "<",
    gt: ">",
  };

  return encodedString
    .replace(translate_re, (_, entity) => {
      return translate[entity as keyof typeof translate];
    })
    .replace(/&#(\d+);/gi, function (_, numStr) {
      const num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
};
