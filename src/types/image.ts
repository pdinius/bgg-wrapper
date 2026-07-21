export const IMAGE_SIZES = [
  "micro",
  "small",
  "medium",
  "large",
  "square",
  "itempage",
  "imagepage",
  "imagepagezoom",
  "expanded",
  "crop100",
  "square200",
  "mediacard",
  "original",
  "listitem",
] as const;

export type ImageSize = (typeof IMAGE_SIZES)[number];

export type ImageOptions = {
  size: ImageSize;
};

export type RawGeekdoImageVariant = {
  url: string;
};

export type RawGeekdoImageResponse = {
  images: Partial<Record<ImageSize, RawGeekdoImageVariant>>;
};
