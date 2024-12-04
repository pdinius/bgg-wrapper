//#region Options
export type GeekListOptions = { comments?: boolean };
//#endregion

//#region Raw Date
export type GeekListRawComment = {
  $: {
    username: string;
    date: string;
    postdate: string;
    editdate: string;
    thumbs: number;
  };
  _v: string;
};

export type GeekListRawResponse = {
  geeklist: {
    $: {
      id: number;
      termsofuse: string;
    };
    postdate: string;
    postdate_timestamp: string;
    editdate: string;
    editdate_timestamp: string;
    thumbs: string;
    numitems: string;
    username: string;
    title: string;
    description: string;
    comment?: Array<GeekListRawComment>;
    item: Array<{
      $: {
        id: number;
        objectid: number;
        objectname: string;
        username: string;
        postdate: string;
        editdate: string;
        thumbs: number;
        imageid: number;
      };
      body: string;
      comment?: Array<GeekListRawComment>;
    }>;
  };
};
//#endregion

//#region Response
export type GeekListComment = {
  postedBy: string;
  postDate: Date;
  editDate: Date;
  thumbs: number;
  text: string;
};

export type GeekListItem = {
  id: string;
  name: string;
  gameId: string;
  imageId: string;
  postedBy: string;
  postDate: Date;
  editDate: Date;
  thumbs: number;
  body: string;
  comments?: Array<GeekListComment>;
};

export type GeekListResponse = {
  id: string;
  postDate: Date;
  postDateTimestamp: string;
  editDate: Date;
  editDateTimestamp: string;
  thumbs: number;
  numItems: number;
  postedBy: string;
  title: string;
  description: string;
  items: Array<GeekListItem>;
  comments?: Array<GeekListComment>;
  termsOfUse: string;
};
// #endregion
