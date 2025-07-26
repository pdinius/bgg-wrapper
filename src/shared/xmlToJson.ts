const NUMBER_REGEX = /^-?\d+(?:\.\d+)?$/;
const stringToVal = (s: string) => (NUMBER_REGEX.test(s) ? parseFloat(s) : s);

const propsToJson = (s: string) => {
  if (!s.trim()) return undefined;
  const props = s.trim().match(/\w+="[^"]+"/g) || [];
  const res: any = {};

  for (const p of props) {
    const [key, val] = p.split(/=(?=")/);
    res[key] = stringToVal(val.slice(1, -1).trim());
  }

  return res;
};

const addToJson = (target: any, key: string, payload: any) => {
  for (const key in payload) {
    if (payload[key] === "" || payload[key] === undefined) delete payload[key];
  }

  if (target[key] === undefined) {
    target[key] = payload;
  } else if (Array.isArray(target[key])) {
    target[key].push(payload);
  } else {
    target[key] = [target[key], payload];
  }
};

const getClosingIndex = (tags: string[], tagName: string) => {
  let depth = 0;

  for (let i = 0; i < tags.length; ++i) {
    if (tags[i].startsWith(`<${tagName}`)) ++depth;
    if (tags[i].startsWith(`</${tagName}`)) --depth;
    if (depth === 0) return i;
  }

  return -1;
};

const xmlToJson = <T>(xml: string): T => {
  const topLevel = xml
    .replace(/\s*\r?\n\s*/g, " ")
    .replace(/<\?xml[^>]+>/, "")
    .replace(/></g, "> <")
    .trim()
    .split(/(?<=>)\s*(?=<)/g);

  const subXml = (tags: string[], depth = 0) => {
    const res: any = {};

    for (let i = 0; i < tags.length; ++i) {
      const tag = tags[i];
      const regexMatch = tag.match(/<\/?([-_\w]+)\s*([^>]*?)\/?>/);
      if (regexMatch === null) {
        throw Error(`Unable to find tag name in "${tag}"`);
      }
      const { 1: tagName, 2: props } = regexMatch;

      if (tag.endsWith("/>")) {
        // <example />
        addToJson(res, tagName, propsToJson(props));
      } else if (/^<[-\w+][^>]*>$/.test(tag)) {
        // <example>
        const closingIndex = getClosingIndex(tags.slice(i), tagName);
        if (closingIndex === -1) {
          throw Error(
            `Could not find closing tag for ${tagName} at depth ${depth}`
          );
        }
        addToJson(res, tagName, {
          $: propsToJson(props),
          ...subXml(tags.slice(i + 1, i + closingIndex), depth + 1),
        });
        i += closingIndex;
      } else if (/^<\/[-\w]+\s*>$/.test(tag)) {
        // </example>
        // ... nothing to do here ...
      } else {
        // <example> ... </example>
        const content = tag.match(/(?<=>).*(?=<)/);
        if (content === null) {
          throw Error(`Could not find inner content: ${tag}`);
        }
        const propsJson = propsToJson(props);
        const value = stringToVal(content[0]);
        if (propsJson && value) {
          addToJson(res, tagName, {
            $: propsJson,
            _content: value,
          });
        } else if (propsJson) {
          addToJson(res, tagName, propsJson);
        } else if (value) {
          addToJson(res, tagName, value);
        }
      }
    }

    return res;
  };

  return subXml(topLevel);
};

export default xmlToJson;
