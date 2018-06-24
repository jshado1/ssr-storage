import _chunk from 'lodash.chunk';
import _map from 'lodash.map';

type CookieMetaData = Partial<{
    domain: string;
    expires: string;
    path: string;
    secure: undefined;
}>;

const bucket = new Map();

const document = {
    get cookie(): string {
        const items = [
            ...bucket,
        ];

        return _map(items, (item) => item.join('='))
            .join('; ');
    },
    // @ts-ignore: TS7010 TS1095
    set cookie(input: string) {
        if (!input) {
            // @ts-ignore: TS2408 is stupid
            return void 0;
        }

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
        }: CookieMetaData = _chunk(pieces, 2)
            .reduce((metadata, [ k, v ]) => {
                metadata[k.trim()] = v;
                return metadata;
            }, {});

        if (
            key
            && expires
            && (new Date(expires)).getTime() < (new Date()).getTime()
        ) {
            bucket.delete(key);
        } else {
            bucket.set(key, val);
        }
    },
};

export default document;
