declare type StorageItemValueType = boolean | number | null | string | undefined;
declare class StorageMock implements Storage {
    [key: string]: any;
    clear(): void;
    getItem(key: string): any;
    key(index: number): string;
    readonly length: number;
    removeItem(key: string): void;
    setItem(key: string, value: StorageItemValueType): StorageItemValueType;
}
declare class LocalStorage extends StorageMock {
}
declare class SessionStorage extends StorageMock {
}
export { StorageMock as default, LocalStorage, SessionStorage, };
