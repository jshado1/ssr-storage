"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const lodash_map_1 = __importDefault(require("lodash.map"));
const bucket = new Map();
const document = {
    get cookie() {
        const items = [
            ...bucket,
        ];
        return lodash_map_1.default(items, (item) => item.join('='))
            .join('; ');
    },
    // @ts-ignore: TS7010 TS1095
    set cookie(input) {
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
        const { expires, } = lodash_chunk_1.default(pieces, 2)
            .reduce((metadata, [k, v]) => {
            metadata[k.trim()] = v;
            return metadata;
        }, {});
        if (key
            && expires
            && (new Date(expires)).getTime() < (new Date()).getTime()) {
            bucket.delete(key);
        }
        else {
            bucket.set(key, val);
        }
    },
};
exports.default = document;
//# sourceMappingURL=cookie.js.map