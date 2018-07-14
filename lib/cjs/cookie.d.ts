/// <reference types="node" />
interface CookieTimerIds {
    [key: string]: NodeJS.Timer;
}
declare type CookieMap = Map<string, any>;
declare const sym: unique symbol;
declare class Document {
    opts: {
        [key: string]: any;
    };
    protected _cookieTimerIds: CookieTimerIds;
    protected [sym]: CookieMap;
    constructor(opts?: {});
    cookie: string;
    readonly cookieTimerIds: CookieTimerIds;
}
export default Document;
