import { expect } from 'chai';
import 'mocha';

import Storage from './webstorage';

describe('WebStorage', () => {
    let storage: Storage;

    beforeEach(() => {
        storage = new Storage();
    });

    it('should add new properties via write', () => {
        const val = 'a';
        storage.foo = val;

        expect(storage.foo).to.equal(val);
    });

    it('should overwrite an existing property with new value', () => {
        const originalVal = 'a';
        const replacementVal = 'b';
        storage.foo = originalVal;

        expect(storage.foo).to.equal(originalVal);

        storage.foo = replacementVal;
        expect(storage.foo).to.equal(replacementVal);
    });

    describe('clear()', () => {
        it('should remove custom properties', () => {
            storage.foo = 'a';
            storage.foo = 'b';

            storage.clear();

            expect(storage.foo).to.be.undefined;
        });
    });

    describe('getItem()', () => {
        it('should retrieve the value of the supplied key', () => {
            const val = 'a';
            storage.foo = val;
            storage.bar = 'b';

            expect(storage.getItem('foo')).to.equal(val);
        });

        it('should return `null` for a non-existant key', () => {
            expect(storage.getItem('foo')).to.equal(null);
        });
    });

    describe('key()', () => {
        it('should retrieve the property name of the supplied index', () => {
            const name = 'foo';
            storage[name] = 'a';
            storage.bar = 'b';

            expect(storage.key(0)).to.equal(name);
        });
    });

    describe('length', () => {
        it('should return the count of custom properties', () => {
            expect(storage, 'starting').to.have.length(0);

            storage.foo = 'a';
            storage.bar = 'b';

            expect(storage, 'after setting items').to.have.length(2);

            delete storage.foo;

            expect(storage, 'after deleting items').to.have.length(1);
        });
    });

    describe('removeItem()', () => {
        it('should remove the item of the supplied key', () => {
            const val = 'a';
            storage.foo = val;

            expect(storage.foo).to.equal(val);

            delete storage.foo;

            expect(storage.foo).to.be.undefined;
        });
    });

    describe('setItem()', () => {
        it('should set the value of the supplied key', () => {
            const val = 'a';
            storage.foo = val;

            expect(storage.foo).to.equal(val);
        });

        it('should overwrite an existing property with new value', () => {
            const originalVal = 'a';
            const replacementVal = 'b';
            storage.foo = originalVal;

            expect(storage.foo).to.equal(originalVal);

            storage.foo = replacementVal;
            expect(storage.foo).to.equal(replacementVal);
        });
    });
});
