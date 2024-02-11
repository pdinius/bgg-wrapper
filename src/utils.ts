type timeString = "milliseconds" | "seconds" | "minutes" | "hours";

const t = (n: number, s: timeString) => {
  switch (s) {
    case "milliseconds":
      return n;
    case "seconds":
      return n * 1000;
    case "minutes":
      return n * 1000 * 60;
    case "hours":
      return n * 1000 * 60 * 60;
  }
};

export function timeout(n: number, s: timeString): Promise<undefined>;
export function timeout(n: number): Promise<undefined>;
export function timeout(n: number, s?: timeString) {
  if (s) {
    return new Promise((res, _) => {
      setTimeout(res, t(n, s));
    });
  } else {
    return new Promise((res, _) => {
      setTimeout(res, n);
    });
  }
}

export const findFirst = <T, S>(
  arr: Array<T>,
  search: Array<S>,
  get: (el: T) => string
): S | null => {
  for (let s of search) {
    for (let el of arr) {
      if (get(el) === s) {
        return s;
      }
    }
  }
  return null;
};

export type OrArray<T> = Array<T> | T;