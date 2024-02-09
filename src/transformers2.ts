import {
  GeekListComment,
  GeekListItem,
  GeekListRawResponse,
  GeekListResponse,
  RawGeekListComment,
} from "./types/types2";

const geekListCommentTransformer = (
  raw: RawGeekListComment
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
