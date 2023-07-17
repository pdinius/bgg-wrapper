export type SubType = "boardgame" | "boardgameexpansion" | "boardgameaccessory";

export type RawCollectionItem = {
  $: {
    objecttype: string;
    objectid: string;
    subtype: SubType;
    collid: string;
  };
  name: {
    $: {
      sortindex: string;
    };
    _v: string;
  };
  yearpublished: string;
  image: string;
  thumbnail: string;
  stats: {
    $: {
      minplayers: string;
      maxplayers: string;
      minplaytime: string;
      maxplaytime: string;
      playingtime: string;
      numowned: string;
    };
    rating: {
      $: {
        value: string;
      };
      usersrated: {
        value: string;
      };
      average: {
        value: string;
      };
      bayesaverage: {
        value: string;
      };
      stddev: {
        value: string;
      };
      median: {
        value: string;
      };
      ranks: {
        rank: Array<{
          type: string;
          id: string;
          name: string;
          friendlyname: string;
          value: string;
          bayesaverage: string;
        }>;
      };
    };
  };
  status: {
    own: string;
    prevowned: string;
    fortrade: string;
    want: string;
    wanttoplay: string;
    wanttobuy: string;
    wishlist: string;
    preordered: string;
    lastmodified: string;
  };
  numplays: string;
};

export type RawCollection = {
  items: {
    $: {
      totalitems: string;
      termsofuse: string;
      pubdate: string;
    };
    item: Array<RawCollectionItem>;
  };
};

export type CollectionItem = {
  id: number;
  subtype: SubType;
  name: string;
  year_published: number;
  image_url: string;
  thumbnail_url: string;
  stats?: {
    min_players: number;
    max_players: number;
    min_playtime: number;
    max_playtime: number;
  };
  rating?: number;
  num_users_rated?: number;
  avg_user_rating?: number;
  geek_rating?: number;
  ranks?: Array<{
    type: string;
    id: number;
    name: string;
    label: string;
    rank: number;
    avg_rating: number;
  }>;
  status: {
    own: boolean;
    prev_owned: boolean;
    for_trade: boolean;
    want: boolean;
    want_to_play: boolean;
    want_to_buy: boolean;
    wishlist: boolean;
    preordered: boolean;
    last_modified: Date;
  };
  num_plays: number;
};

export type Collection = {
  total_items: number;
  retrieved_date: Date;
  items: Array<CollectionItem>;
};

export type RawItem = {
  $: {
    type: SubType;
    id: string;
  };
  thumbnail: string;
  image: string;
  name: Array<{
    type: "primary" | "alternate";
    sortindex: string;
    value: string;
  }>;
  description: string;
  yearpublished: {
    value: string;
  };
  minplayers: {
    value: string;
  };
  maxplayers: {
    value: string;
  };
  poll: [
    {
      $: {
        name: "suggested_numplayers";
        title: string;
        totalvotes: string;
      };
      results: Array<{
        $: {
          numplayers: string;
        };
        result: Array<{
          value: string;
          numvotes: string;
        }>;
      }>;
    },
    {
      $: {
        name: "suggested_playerage";
        title: string;
        totalvotes: string;
      };
      results: {
        result: Array<{
          value: string;
          numvotes: string;
        }>;
      };
    },
    {
      $: {
        name: "language_dependence";
        title: string;
        totalvotes: string;
      };
      results: {
        result: Array<{
          level: string;
          value: string;
          numvotes: string;
        }>;
      };
    }
  ];
  playingtime: {
    value: string;
  };
  minplaytime: {
    value: string;
  };
  maxplaytime: {
    value: string;
  };
  minage: {
    value: string;
  };
  link: Array<{
    type: string;
    id: string;
    value: string;
  }>;
  statistics?: {
    $: {
      page: string;
    };
    ratings: {
      usersrated: {
        value: string;
      };
      average: {
        value: string;
      };
      bayesaverage: {
        value: string;
      };
      ranks: {
        rank: Array<{
          type: string;
          id: string;
          name: string;
          friendlyname: string;
          value: string;
          bayesaverage: string;
        }>;
      };
      stddev: {
        value: string;
      };
      median: {
        value: string;
      };
      owned: {
        value: string;
      };
      trading: {
        value: string;
      };
      wanting: {
        value: string;
      };
      wishing: {
        value: string;
      };
      numcomments: {
        value: string;
      };
      numweights: {
        value: string;
      };
      averageweight: {
        value: string;
      };
    };
  };
};

export type RawThing = {
  items: {
    $: {
      termsofuse: string;
    };
    item: RawItem | Array<RawItem>;
  };
};

export type PollResult = {
  option: string;
  num_votes: number;
};

export type Poll = {
  name: string;
  label: string;
  total_votes: number;
  results?: Array<PollResult>;
};

export type Thing = {
  name: string;
  id: number;
  type: SubType;
  image_url: string;
  thumbnail_url: string;
  alternate_names: Array<string>;
  description: string;
  year_published: number;
  min_players: number;
  max_players: number;
  min_playtime: number;
  max_playtime: number;
  min_age: number;
  related_items: Array<{
    name: string;
    id: number;
    type: string;
  }>;
  polls: Array<Poll>;
  stats?: {
    num_ratings: number;
    rating: number;
    geek_rating: number;
    ranks: Array<{
      type: string;
      id: number;
      label: string;
      rank: number;
    }>;
    num_owners: number;
    num_trading: number;
    num_wanting: number;
    num_wishing: number;
    num_comments: number;
    num_weights: number;
    avg_weight: number;
  };
};

export type Command = "collection" | "thing";

type CommandParamsDef = {
  [key in Command]: {
    raw_response: RawCollection | RawThing;
    transformed_response: Collection | Array<Thing>;
    params: {
      [key: string]: string | number | Array<number> | boolean | Date
    };
  };
};

export interface CommandParams extends CommandParamsDef {
  collection: {
    raw_response: RawCollection;
    params: {
      username: string;
      // version?: number;
      subtype?: SubType;
      excludesubtype?: SubType;
      id?: number | Array<number>;
      // brief?: boolean;
      stats?: boolean;
      own?: boolean;
      rated?: boolean;
      played?: boolean;
      comment?: boolean;
      trade?: boolean;
      want?: boolean;
      wishlist?: boolean;
      wishlistpriority?: number; // 1 - 5
      preordered?: boolean;
      wanttoplay?: boolean;
      wanttobuy?: boolean;
      prevowned?: boolean;
      hasparts?: boolean;
      wantparts?: boolean;
      minrating?: number; // 1 - 10
      rating?: number; // 1 - 10
      minbggrating?: number; // 1 - 10
      bggrating?: number; // 1 - 10
      minplays?: number;
      maxplays?: number;
      // showprivate?: boolean;
      modifiedsince?: Date;
    };
    transformed_response: Collection;
  };
  thing: {
    raw_response: RawThing;
    params: {
      id: number | Array<number>;
      // type?: SubType;
      // versions?: boolean;
      // videos?: boolean;
      stats?: boolean;
      // marketplace?: boolean;
      // comments?: boolean;
      // ratingcomments?: boolean;
      // page?: number;
      // pagesize?: number; // between 10 and 100
    };
    transformed_response: Array<Thing>;
  };
}
