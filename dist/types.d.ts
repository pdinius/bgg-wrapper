export type SubType = "boardgame" | "boardgameexpansion" | "boardgameaccessory";
export type RawCollection = {
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
    image: [string];
    thumbnail: [string];
    stats: [
        {
            $: {
                minplayers: string;
                maxplayers: string;
                minplaytime: string;
                maxplaytime: string;
                playingtime: string;
                numowned: string;
            };
            rating: [
                {
                    $: {
                        value: string;
                    };
                    usersrated: [
                        {
                            $: {
                                value: string;
                            };
                        }
                    ];
                    average: [
                        {
                            $: {
                                value: string;
                            };
                        }
                    ];
                    bayesaverage: [
                        {
                            $: {
                                value: string;
                            };
                        }
                    ];
                    stddev: [
                        {
                            $: {
                                value: string;
                            };
                        }
                    ];
                    median: [
                        {
                            $: {
                                value: string;
                            };
                        }
                    ];
                    ranks: [
                        {
                            rank: [
                                {
                                    $: {
                                        type: string;
                                        id: string;
                                        name: string;
                                        friendlyname: string;
                                        value: string;
                                        bayesaverage: string;
                                    };
                                },
                                {
                                    $: {
                                        type: string;
                                        id: string;
                                        name: string;
                                        friendlyname: string;
                                        value: string;
                                        bayesaverage: string;
                                    };
                                }
                            ];
                        }
                    ];
                }
            ];
        }
    ];
    status: [
        {
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
        }
    ];
    numplays: [string];
};
export type BGGItem = {
    id: number;
    subtype: SubType;
    name: string;
    year_published: number;
    image_url: string;
    thumbnail_url: string;
    stats: {
        min_players: number;
        max_players: number;
        min_playtime: number;
        max_playtime: number;
    };
    rating: number;
    num_users_rated: number;
    avg_user_rating: number;
    geek_rating: number;
    ranks: Array<{
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
//# sourceMappingURL=types.d.ts.map