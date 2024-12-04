import {
  GeekListComment,
  GeekListItem,
  GeekListRawComment,
  GeekListRawResponse,
  GeekListResponse,
} from "../types/geeklist";

const geekListCommentTransformer = (
  raw: GeekListRawComment
): GeekListComment => {
  return {
    postedBy: raw?.$?.username,
    postDate: new Date(raw?.$?.username),
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
    postDate: new Date(raw.geeklist?.postdate),
    postDateTimestamp: raw.geeklist?.postdate_timestamp,
    editDate: new Date(raw.geeklist?.editdate),
    editDateTimestamp: raw.geeklist?.editdate_timestamp,
    thumbs: Number(raw.geeklist?.thumbs),
    numItems: Number(raw.geeklist?.numitems),
    postedBy: raw.geeklist?.username,
    title: raw.geeklist?.title,
    description: raw.geeklist?.description,
    items:
      raw.geeklist?.item?.map((item) => {
        const res: GeekListItem = {
          id: String(item.$?.id),
          gameId: String(item.$?.objectid),
          imageId: String(item.$?.imageid),
          name: item.$?.objectname,
          postedBy: item.$?.username,
          postDate: new Date(item.$?.postdate),
          editDate: new Date(item.$?.editdate),
          thumbs: item.$?.thumbs,
          body: typeof item.body === "string" ? item.body : "",
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
    termsOfUse: raw.geeklist?.$?.termsofuse,
  };

  if (raw.geeklist?.comment) {
    res.comments = raw.geeklist.comment.map(geekListCommentTransformer);
  }

  return res;
};
