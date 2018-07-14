"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StorageMock {
    clear() {
        for (const p in this)
            delete this[p];
    }
    getItem(key) {
        return key in this
            ? this[key]
            : null;
    }
    key(index) {
        return Object.keys(this)[index];
    }
    get length() {
        return Object.keys(this).length;
    }
    removeItem(key) {
        delete this[key];
    }
    setItem(key, value) {
        return this[key] = value;
    }
}
exports.default = StorageMock;
/* tslint:disable:max-classes-per-file */
class LocalStorage extends StorageMock {
}
exports.LocalStorage = LocalStorage;
class SessionStorage extends StorageMock {
}
exports.SessionStorage = SessionStorage;
//# sourceMappingURL=webstorage.js.map