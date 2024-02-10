export type HotRawResponse = {
  items: {
    $: {
      termsofuse: string;
    };
    item: Array<{
      $: {
        id: number;
        rank: number;
      };
      thumbnail: {
        value: string;
      };
      name: {
        value: string;
      };
      yearpublished: {
        value: number;
      };
    }>;
  };
};

export type HotItem = {
  id: string;
  name: string;
  thumbnail: string;
  rank: number;
  yearPublished: number;
};

export type HotResponse = {
  items: Array<HotItem>;
  termsofuse: string;
};
