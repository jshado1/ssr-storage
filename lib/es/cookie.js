var _a;
import _camelCase from '../../node_modules/lodash-es/camelCase';
import _chunk from '../../node_modules/lodash-es/chunk';
import _map from '../../node_modules/lodash-es/map';
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
        return _map(items, (item) => item.join('='))
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
        const { expires, maxAge, } = _chunk(pieces, 2)
            .reduce((metadata, [k, v]) => {
            metadata[_camelCase(k.trim())] = v;
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
export default Document;
//# sourceMappingURL=cookie.js.map
