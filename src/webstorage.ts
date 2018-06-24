type StorageItemValueType = boolean | number | null | string | undefined;

class StorageMock implements Storage {
    [key: string]: any;

    public clear() {
        for (const p in this) delete this[p];
    }

    public getItem(key: string) {
        return key in this
            ? this[key]
            : null;
    }

    public key(index: number) {
        return Object.keys(this)[index];
    }

    get length() {
        return Object.keys(this).length;
    }

    public removeItem(key: string) {
        delete this[key];
    }

    public setItem(key: string, value: StorageItemValueType) {
        return this[key] = value;
    }
}

/* tslint:disable:max-classes-per-file */
class LocalStorage extends StorageMock {}
class SessionStorage extends StorageMock {}
/* tslint:enable:max-classes-per-file */

export {
    StorageMock as default,
    LocalStorage,
    SessionStorage,
};
