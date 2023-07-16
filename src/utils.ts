const t = (n: number, s: "milliseconds" | "seconds" | "minutes" | "hours") => {
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

const timeout = (...args: Parameters<typeof t>) => {
  return new Promise((res, _) => {
    setTimeout(res, t(...args));
  });
};
