import {
  CollectionItem,
  CollectionRawItem,
  CollectionRawResponse,
  CollectionResponse,
} from "../types/collection";

const collectionItemTransformer = (raw: CollectionRawItem): CollectionItem => {
  return {
    name: raw.name?._v,
    gameId: raw.$.objectid.toString(),
    subtype: raw.$.subtype,
    yearPublished: parseInt(raw.yearpublished),
    imageUri: raw.image,
    thumbnailUri: raw.thumbnail,
    status: {
      own: Boolean(raw.status?.own),
      prevOwned: Boolean(raw.status?.prevowned),
      forTrade: Boolean(raw.status?.fortrade),
      want: Boolean(raw.status?.want),
      wantToPlay: Boolean(raw.status?.wanttoplay),
      wantToBuy: Boolean(raw.status?.wanttobuy),
      wishlist: Boolean(raw.status?.wishlist),
      preordered: Boolean(raw.status?.preordered),
      lastModified: new Date(raw.status?.lastmodified),
    },
    numPlays: parseInt(raw.numplays),
  };
};

export const collectionTransformer = (
  raw: CollectionRawResponse
): CollectionResponse => {
  const { items } = raw;

  return {
    totalItems: items?.$?.totalitems,
    publishedDate: new Date(items?.$?.pubdate),
    items: (items?.item || []).map(collectionItemTransformer),
    termsOfUse: items?.$?.termsofuse,
  };
};
