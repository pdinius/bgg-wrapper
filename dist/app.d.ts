import { SubType } from "./types";
interface CommandParams {
    collection: {
        username: string;
        version?: number;
        subtype?: SubType;
        excludesubtype?: SubType;
        id?: string | Array<string>;
        brief?: boolean;
        stats?: boolean;
        own?: boolean;
        rated?: boolean;
        played?: boolean;
        comment?: boolean;
        trade?: boolean;
        want?: boolean;
        wishlist?: boolean;
        wishlistpriority?: number;
        preordered?: boolean;
        wanttoplay?: boolean;
        wanttobuy?: boolean;
        prevowned?: boolean;
        hasparts?: boolean;
        wantparts?: boolean;
        minrating?: number;
        rating?: number;
        minbggrating?: number;
        bggrating?: number;
        minplays?: number;
        maxplays?: number;
        showprivate?: boolean;
        modifiedsince?: Date;
    };
}
export declare const bgg: <Command extends "collection">(c: Command, params: CommandParams[Command]) => void;
export {};
//# sourceMappingURL=app.d.ts.map