import { transformRawThingToBggThing } from "./transformers";

export type SubType = "boardgame" | "boardgameexpansion" | "boardgameaccessory";

export type RawCollectionItem = {
  $: {
    objecttype: string;
    objectid: string;
    subtype: string;
    collid: string;
  };
  name: [
    {
      _: string;
      $: {
        sortindex: string;
      };
    }
  ];
  yearpublished: Array<string>;
  image: Array<string>;
  thumbnail: Array<string>;
  stats: Array<{
    $: {
      minplayers: string;
      maxplayers: string;
      minplaytime: string;
      maxplaytime: string;
      playingtime: string;
      numowned: string;
    };
    rating: Array<{
      $: {
        value: string;
      };
      usersrated: Array<{
        $: {
          value: string;
        };
      }>;
      average: Array<{
        $: {
          value: string;
        };
      }>;
      bayesaverage: Array<{
        $: {
          value: string;
        };
      }>;
      stddev: Array<{
        $: {
          value: string;
        };
      }>;
      median: Array<{
        $: {
          value: string;
        };
      }>;
      ranks: Array<{
        rank: Array<{
          $: {
            type: string;
            id: string;
            name: string;
            friendlyname: string;
            value: string;
            bayesaverage: string;
          };
        }>;
      }>;
    }>;
  }>;
  status: Array<{
    $: {
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
  }>;
  numplays: Array<string>;
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
}

export type RawThing = {
  items: {
    $: {
      termsofuse: string;
    };
    item: Array<{
      $: {
        type: SubType;
        id: string;
      };
      thumbnail: Array<string>;
      image: Array<string>;
      name: Array<{
        $: {
          type: "primary" | "alternate";
          sortindex: string;
          value: string;
        };
      }>;
      description: Array<string>;
      yearpublished: Array<{
        $: {
          value: string;
        };
      }>;
      minplayers: Array<{
        $: {
          value: string;
        };
      }>;
      maxplayers: Array<{
        $: {
          value: string;
        };
      }>;
      poll: Array<{
        $: {
          name: string;
          title: string;
          totalvotes: string;
        };
        results?: Array<{
          $?: {
            [key: string]: string;
          };
          result: Array<{
            $: {
              level?: string;
              value: string;
              numvotes: string;
            };
          }>;
        }>;
      }>;
      playingtime: Array<{
        $: {
          value: string;
        };
      }>;
      minplaytime: Array<{
        $: {
          value: string;
        };
      }>;
      maxplaytime: Array<{
        $: {
          value: string;
        };
      }>;
      minage: Array<{
        $: {
          value: string;
        };
      }>;
      link: Array<{
        $: {
          type: string;
          id: string;
          value: string;
        };
      }>;
      statistics?: Array<{
        $: {
          page: string;
        };
        ratings: Array<{
          usersrated: Array<{
            $: {
              value: string;
            };
          }>;
          average: Array<{
            $: {
              value: string;
            };
          }>;
          bayesaverage: Array<{
            $: {
              value: string;
            };
          }>;
          ranks: Array<{
            rank: Array<{
              $: {
                type: string;
                id: string;
                name: string;
                friendlyname: string;
                value: string;
                bayesaverage: string;
              };
            }>;
          }>;
          stddev: Array<{
            $: {
              value: string;
            };
          }>;
          median: Array<{
            $: {
              value: string;
            };
          }>;
          owned: Array<{
            $: {
              value: string;
            };
          }>;
          trading: Array<{
            $: {
              value: string;
            };
          }>;
          wanting: Array<{
            $: {
              value: string;
            };
          }>;
          wishing: Array<{
            $: {
              value: string;
            };
          }>;
          numcomments: Array<{
            $: {
              value: string;
            };
          }>;
          numweights: Array<{
            $: {
              value: string;
            };
          }>;
          averageweight: Array<{
            $: {
              value: string;
            };
          }>;
        }>;
      }>;
    }>;
  };
};

export type BggThing = {
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
  polls: Array<{
    name: string;
    label: string;
    total_votes: number;
    results?: Array<{
      option: string;
      num_votes: number;
    }>;
  }>;
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

export type Command = 'collection' | 'thing';

type CommandParamsDef = {
  [key in Command]: {
    raw_response: any;
    transformed_response: any;
    params: any;
  }
}

export interface CommandParams extends CommandParamsDef {
  collection: {
    raw_response: RawCollection;
    params: {
      username: string;
      // version?: number;
      subtype?: SubType;
      excludesubtype?: SubType;
      id?: string | Array<string>;
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
    transformed_response: Array<BggThing>;
  };
}
