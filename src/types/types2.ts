// GEEKLIST

export type RawGeekListComment = {
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
    comment?: Array<RawGeekListComment>;
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
      comment?: Array<RawGeekListComment>;
    }>;
  };
};

export type GeekListComment = {
  postedBy: string;
  postdate: Date;
  editDate: Date;
  thumbs: number;
  text: string;
};

export type GeekListItem = {
  id: string;
  name: string;
  gameid: string;
  imageId: string;
  postedBy: string;
  postdate: Date;
  editDate: Date;
  thumbs: number;
  body: string;
  comments?: Array<GeekListComment>;
};

export type GeekListResponse = {
  id: string;
  postdate: Date;
  postdateTimestamp: string;
  editdate: Date;
  editdateTimestamp: string;
  thumbs: number;
  numItems: number;
  postedBy: string;
  title: string;
  description: string;
  items: Array<GeekListItem>;
  comments?: Array<GeekListComment>;
  termsofuse: string;
};

export type GeekListOptions = { comments: boolean };
