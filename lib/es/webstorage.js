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
/* tslint:disable:max-classes-per-file */
class LocalStorage extends StorageMock {
}
class SessionStorage extends StorageMock {
}
/* tslint:enable:max-classes-per-file */
export { StorageMock as default, LocalStorage, SessionStorage, };
//# sourceMappingURL=webstorage.js.map