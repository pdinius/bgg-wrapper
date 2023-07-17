const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<items totalitems="1861" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse" pubdate="Sun, 16 Jul 2023 05:50:27 +0000">
	<item objecttype="thing" objectid="226255" subtype="boardgame" collid="48321856">
		<name sortindex="1">1920 Wall Street</name>
		<yearpublished>2017</yearpublished>
		<image>https://cf.geekdo-images.com/vBbczoUk2PXPEtbwJCc8JA__original/img/1Oz5BlBRcmjD78huuq5TlyOWDLw=/0x0/filters:format(jpeg)/pic3674450.jpg</image>
		<thumbnail>https://cf.geekdo-images.com/vBbczoUk2PXPEtbwJCc8JA__thumb/img/weW2Mgux4hMCPlmH69NPu40SzX8=/fit-in/200x150/filters:strip_icc()/pic3674450.jpg</thumbnail>
		<stats minplayers="2" maxplayers="5" minplaytime="45" maxplaytime="60" playingtime="60" numowned="1327">
			<rating value="5">
				<usersrated value="618"/>
				<average value="6.76199"/>
				<bayesaverage value="5.78264"/>
				<stddev value="1.28313"/>
				<median value="0"/>
				<ranks>
					<rank type="subtype" id="1" name="boardgame" friendlyname="Board Game Rank" value="4339" bayesaverage="5.78264"/>
					<rank type="family" id="5497" name="strategygames" friendlyname="Strategy Game Rank" value="1694" bayesaverage="5.85469"/>
				</ranks>
			</rating>
		</stats>
		<status own="0" prevowned="0" fortrade="0" want="0" wanttoplay="0" wanttobuy="0" wishlist="0" preordered="0" lastmodified="2018-01-03 13:08:12"/>
		<numplays>1</numplays>
	</item>
</items>`;

const parseSingleEntity = (xml: string) => {
  const res: any = {};

  const props = xml.match(/\w+="(?:[^"]|(?<=\\)")*"/g) || [];
  for (let p of props) {
    let [key, value] = p.split('="');
    value = value.slice(0, -1);
    res[key] = value;
  }

  return res;
};

const parse = (xml: string) => {
  xml = xml.replace(/<\?xml[^>]+>/g, "");
  const splitted = xml
    .split(/(?<=>)|(?=<\/)/)
    .map((v) => v.replace(/^\s+/, ""))
    .filter((v) => v);

  const format = (lines: Array<string>) => {
    if (!lines[0].startsWith('<')) {
      return lines[0];
    } else {
      const res: any = {};

      while (lines.length > 0) {
        const tag = lines[0].match(/[^<>\s]+/)![0];
        if (res[tag] !== undefined) {
          res[tag] = [res[tag]];
        }

        let value: any;

        if (lines[0].endsWith('/>')) {
          value = parseSingleEntity(lines[0]);
          lines = lines.slice(1);
        } else {
          const props = parseSingleEntity(lines[0]);
          const closingTagIdx = lines.findIndex(l => RegExp(`^</\\s*${tag}`).test(l));
          value = format(lines.slice(1, closingTagIdx));
          lines = lines.slice(closingTagIdx + 1);
        }

        if (Array.isArray(res[tag])) {
          res[tag].push(value);
        } else {
          res[tag] = value;
        }
      }

      return res;
    }
  };

  return format(splitted);
};

console.log(JSON.stringify(parse(xml), null, 2));
