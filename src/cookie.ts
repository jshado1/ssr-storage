import _camelCase from 'lodash.camelcase';
import _chunk from 'lodash.chunk';
import _map from 'lodash.map';

type CookieMetadata = Partial<{
    [index: string]: string | undefined;
    domain: string;
    expires: string;
    maxAge: string;
    path: string;
    secure: undefined;
}>;

interface CookieTimerIds { [key: string]: NodeJS.Timer; }
type CookieMap = Map<string, any>;

const sym = Symbol('bucket');

const delayedCookieDelete = (
    bucket: CookieMap,
    k: string,
    _cookieTimerIds: CookieTimerIds,
) => {
    bucket.delete(k);
    delete _cookieTimerIds[k];
};

class Document {
    public opts: { [key: string]: any } = {
        setTimers: false,
    };
    protected _cookieTimerIds: CookieTimerIds = {};
    protected [sym]: CookieMap = new Map();

    constructor(opts = {}) {
        Object.assign(this.opts, opts);

        Object.defineProperties(this, {
            _cookieTimerIds: {
                enumerable: false,
            },
            cookie: {
                ...Object.getOwnPropertyDescriptors(Document.prototype).cookie,
                enumerable: true,
            },
            opts: {
                enumerable: false,
            },
            [sym]: {
                enumerable: false,
            },
        });
    }

    get cookie(): string {
        const items = [
            ...this[sym],
        ];

        return _map(items, (item) => item.join('='))
            .join('; ');
    }

    // @ts-ignore: TS7010 TS1095
    set cookie(input: string) {
        if (!input) {
            // @ts-ignore: TS2408 is stupid
            return void 0;
        }

        const {
            _cookieTimerIds,
            opts: { setTimers },
            [sym]: bucket,
        } = this;

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

        const {
            expires,
            maxAge,
        }: CookieMetadata = _chunk(pieces, 2)
            .reduce((metadata, [ k, v ]) => {
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
                _cookieTimerIds[key] = setTimeout(
                    delayedCookieDelete,
                    expiry,
                    bucket,
                    key,
                    _cookieTimerIds,
                );
                // fall through to the set() below
            }
        }
        else if (
            maxAge !== undefined
        ) {
            const maxAgeInt = parseInt(maxAge, 10);

            if (maxAgeInt === 0) {
                clearTimeout(_cookieTimerIds[key]);
                // @ts-ignore: TS2408 is stupid
                return bucket.delete(key);
            }
            if (setTimers) {
                _cookieTimerIds[key] = setTimeout(
                    delayedCookieDelete,
                    maxAgeInt,
                    bucket,
                    key,
                    _cookieTimerIds,
                );
                // fall through to the set() below
            }
        }

        bucket.set(key, val);
    }

    get cookieTimerIds() {
        return this._cookieTimerIds;
    }
}

export default Document;
