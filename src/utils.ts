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

function timeout(n: number, s: timeString): Promise<undefined>;
function timeout(n: number): Promise<undefined>;

function timeout(n: number, s?: timeString): Promise<undefined> {
  if (s) {
    return new Promise((res, _) => {
      setTimeout(res, t(n, s))
    });
  } else {
    return new Promise((res, _) => {
      setTimeout(res, n)
    });
  }
};

// const timeout = (n: number) => {
//   return new Promise((res, _) => {
//     setTimeout(res, n);
//   });
// };
