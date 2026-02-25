import { items } from "./dt-data.json";

const groupBy = <T>(o: T[], fn: (v: T) => string | number) => {
  const res: { [key: string | number]: number } = {};
  for (const item of o) {
    const key = fn(item);
    if (!(key in res)) res[key] = 0;
    ++res[key];
  }
  return res;
};

console.log(items.filter(v => v.yearPublished === 2025).map(v => v.name));
