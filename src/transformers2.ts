import { GeekListComment, GeekListItem, GeekListRawComment, GeekListRawResponse, GeekListResponse } from "./types/geeklist";
import { HotRawResponse, HotResponse } from "./types/hot";
import { SearchRawResponse, SearchResponse, SearchResult, SearchResultRaw } from "./types/search";

const geekListCommentTransformer = (
  raw: GeekListRawComment
): GeekListComment => {
  return {
    postedBy: raw?.$?.username,
    postdate: new Date(raw?.$?.username),
    editDate: new Date(raw?.$?.editdate),
    thumbs: raw?.$?.thumbs,
    text: raw?._v,
  };
};

export const geeklistTransformer = (
  raw: GeekListRawResponse
): GeekListResponse => {
  const res: GeekListResponse = {
    id: String(raw.geeklist?.$?.id),
    postdate: new Date(raw.geeklist?.postdate),
    postdateTimestamp: raw.geeklist?.postdate_timestamp,
    editdate: new Date(raw.geeklist?.editdate),
    editdateTimestamp: raw.geeklist?.editdate_timestamp,
    thumbs: Number(raw.geeklist?.thumbs),
    numItems: Number(raw.geeklist?.numitems),
    postedBy: raw.geeklist?.username,
    title: raw.geeklist?.title,
    description: raw.geeklist?.description,
    items:
      raw.geeklist?.item?.map((item) => {
        const res: GeekListItem = {
          id: String(item.$?.id),
          gameid: String(item.$?.objectid),
          imageId: String(item.$?.imageid),
          name: item.$?.objectname,
          postedBy: item.$?.username,
          postdate: new Date(item.$?.postdate),
          editDate: new Date(item.$?.editdate),
          thumbs: item.$?.thumbs,
          body: item.body,
        };

        if (item?.comment) {
          if (Array.isArray(item.comment)) {
            res.comments = item.comment.map(geekListCommentTransformer);
          } else {
            res.comments = [geekListCommentTransformer(item.comment)];
          }
        }

        return res;
      }) || [],
    termsofuse: raw.geeklist?.$?.termsofuse,
  };

  if (raw.geeklist?.comment) {
    res.comments = raw.geeklist.comment.map(geekListCommentTransformer);
  }

  return res;
};

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
    termsofuse: raw.items?.$?.termsofuse,
  };
};

const searchResultTransformer = (raw: SearchResultRaw): SearchResult => {
  return {
    type: raw.$?.type,
    id: String(raw.$?.id),
    name: raw.name?.value,
    nameType: raw.name?.type,
    yearPublished: raw.yearpublished?.value,
  };
};

export const searchTransformer = (raw: SearchRawResponse): SearchResponse => {
  let items: Array<SearchResult> = [];

  if (Array.isArray(raw.items?.item)) {
    items = raw.items?.item?.map(searchResultTransformer);
  } else {
    items = [searchResultTransformer(raw.items?.item)];
  }

  return {
    numItems: raw.items?.$?.total,
    items,
    termsofuse: raw.items?.$?.termsofuse,
  };
};
