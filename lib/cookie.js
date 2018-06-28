"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
"use strict";
const lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const lodash_map_1 = __importDefault(require("lodash.map"));
const sym = Symbol('bucket');
const delayedCookieDelete = (bucket, k, _cookieTimerIds) => {
    bucket.delete(k);
    delete _cookieTimerIds[k];
};
class Document {
    constructor(opts = {}) {
        this.opts = {
            setTimers: false,
        };
        this._cookieTimerIds = {};
        this[_a] = new Map();
        Object.assign(this.opts, opts);
        Object.defineProperties(this, {
            _cookieTimerIds: {
                enumerable: false,
            },
            cookie: Object.assign({}, Object.getOwnPropertyDescriptors(Document.prototype).cookie, { enumerable: true }),
            opts: {
                enumerable: false,
            },
            [sym]: {
                enumerable: false,
            },
        });
    }
    get cookie() {
        const items = [
            ...this[sym],
        ];
        return lodash_map_1.default(items, (item) => item.join('='))
            .join('; ');
    }
    // @ts-ignore: TS7010 TS1095
    set cookie(input) {
        if (!input) {
            // @ts-ignore: TS2408 is stupid
            return void 0;
        }
        const { _cookieTimerIds, opts: { setTimers }, [sym]: bucket, } = this;
        if (input === '__VOID_BUCKET__') { // for spec
            // @ts-ignore: TS2408 is stupid
            return bucket.clear();
        }
        const pieces = input.split(/[=;]/);
        const key = pieces.shift().trim();
        const val = pieces.shift().trim();
        if (!key) {
            // @ts-ignore: TS2408 is stupid
            return void 0;
        }
        const { expires, maxAge, } = lodash_chunk_1.default(pieces, 2)
            .reduce((metadata, [k, v]) => {
            metadata[lodash_camelcase_1.default(k.trim())] = v;
            return metadata;
        }, {});
        if (expires) {
            const expiry = (new Date(expires)).getTime();
            const now = (new Date()).getTime();
            if (expiry < now) {
                clearTimeout(_cookieTimerIds[key]);
                // @ts-ignore: TS2408 is stupid
                return bucket.delete(key);
            }
            if (setTimers) {
                _cookieTimerIds[key] = setTimeout(delayedCookieDelete, expiry, bucket, key, _cookieTimerIds);
                // fall through to the set() below
            }
        }
        else if (maxAge !== undefined) {
            const maxAgeInt = parseInt(maxAge, 10);
            if (maxAgeInt === 0) {
                clearTimeout(_cookieTimerIds[key]);
                // @ts-ignore: TS2408 is stupid
                return bucket.delete(key);
            }
            if (setTimers) {
                _cookieTimerIds[key] = setTimeout(delayedCookieDelete, maxAgeInt, bucket, key, _cookieTimerIds);
                // fall through to the set() below
            }
        }
        bucket.set(key, val);
    }
    get cookieTimerIds() {
        return this._cookieTimerIds;
    }
}
_a = sym;
exports.default = Document;
//# sourceMappingURL=cookie.js.map