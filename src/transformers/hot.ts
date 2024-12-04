import { HotRawResponse, HotResponse } from "../types/hot";

export const hotTransformer = (raw: HotRawResponse): HotResponse => {
  return {
    items:
      raw.items?.item?.map((item) => {
        return {
          id: String(item.$?.id),
          name: item.name?.value,
          thumbnail: item.thumbnail?.value,
          rank: item.$?.rank,
          yearPublished: item.yearpublished?.value,
        };
      }) || [],
    termsOfUse: raw.items?.$?.termsofuse,
  };
};
