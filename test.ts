interface f {
  items: {
    item: {
      name: string;
      yearpublished: string;
      image: string;
      thumbnail: string;
      stats: {
        rating: {
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
  };
}
