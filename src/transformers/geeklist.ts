import { decodeEntities, invariantArray } from "../shared/utils";
import {
  GeeklistItemInformation,
  GeeklistResponse,
  RawGeeklistItem,
  RawGeeklistResponse,
} from "../types/geeklist";

const GeeklistItemTransformer = (
  raw: RawGeeklistItem,
): GeeklistItemInformation => {
  const {
    $: {
      id,
      objecttype,
      subtype,
      objectid,
      objectname,
      username,
      postdate,
      editdate,
      thumbs,
      imageid,
    },
    body,
  } = raw;

  return {
    id,
    objectType: objecttype,
    type: subtype,
    objectId: objectid,
    name: decodeEntities(objectname),
    username,
    postDate: new Date(postdate),
    editDate: new Date(editdate),
    thumbs,
    imageId: imageid,
    body: decodeEntities(body),
  };
};

export const GeeklistTransformer = (
  raw: RawGeeklistResponse,
): GeeklistResponse => {
  const {
    geeklist: {
      $: { id, termsofuse },
      postdate,
      editdate,
      thumbs,
      numitems,
      username,
      title,
      description,
      item,
    },
  } = raw;

  return {
    termsOfUse: termsofuse,
    id,
    postDate: new Date(postdate),
    editDate: new Date(editdate),
    thumbs,
    numItems: numitems,
    username,
    title: decodeEntities(title),
    description: decodeEntities(description),
    items: item === undefined ? [] : invariantArray(item).map(GeeklistItemTransformer),
  };
};
