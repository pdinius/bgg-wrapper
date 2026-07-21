import { ThingType } from "./general";

// Raw Response

export interface RawGeeklistItem {
  $: {
    id: number;
    objecttype: string;
    subtype: ThingType;
    objectid: number;
    objectname: string;
    username: string;
    postdate: string;
    editdate: string;
    thumbs: number;
    imageid: number;
  };
  body: string;
}

export interface RawGeeklistResponse {
  geeklist: {
    $: {
      id: number;
      termsofuse: string;
    };
    postdate: string;
    postdate_timestamp: number;
    editdate: string;
    editdate_timestamp: number;
    thumbs: number;
    numitems: number;
    username: string;
    title: string;
    description: string;
    item?: RawGeeklistItem | RawGeeklistItem[];
  };
}

// Returned Item

export interface GeeklistItemInformation {
  id: number;
  objectType: string;
  type: ThingType;
  objectId: number;
  name: string;
  username: string;
  postDate: Date;
  editDate: Date;
  thumbs: number;
  imageId: number;
  body: string;
}

export interface GeeklistResponse {
  termsOfUse: string;
  id: number;
  postDate: Date;
  editDate: Date;
  thumbs: number;
  numItems: number;
  username: string;
  title: string;
  description: string;
  items: GeeklistItemInformation[];
}
