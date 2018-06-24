import { expect } from 'chai';
import 'mocha';

import doc from './cookie';

describe('Cookie', () => {
    afterEach(() => {
        doc.cookie = '__VOID_BUCKET__';
    });

    it('should be enumerable', () => {
        expect(Object.keys(doc)).to.include('cookie');
    });

    describe('get', () => {
        it('should return an empty string when no cookies have been set', () => {
            expect(doc.cookie).to.equal('');
        });

        it('should retrieve the cumulatively value of stored items', () => {
            doc.cookie = 'hello=world';
            doc.cookie = 'foo=bar';

            expect(doc.cookie).to.equal('hello=world; foo=bar');
        });
    });

    describe('set', () => {
        it('should store the supplied item', () => {
            const val = 'hello=world';
            doc.cookie = val;

            expect(doc.cookie).to.equal(val);
        });

        it('should abort when supplied empty/falsy input', () => {
            const val = 'hello=world';
            doc.cookie = val;
            doc.cookie = '';

            expect(doc.cookie).to.equal(val);
        });

        it('should abort when supplied an empty/falsy key', () => {
            doc.cookie = '=world';

            expect(doc.cookie).to.equal('');
        });

        it('should cumulatively store the supplied items', () => {
            const item1 = 'foo=bar';
            const item2 = 'qux=zed';
            doc.cookie = item1;
            doc.cookie = item2;

            expect(doc.cookie).to.equal(`${item1}; ${item2}`);
        });

        it('should replace the value of an existing item with a newly supplied one', () => {
            const val1 = 'hello=world';
            const val2 = 'hello=foo';
            doc.cookie = val1;

            expect(doc.cookie).to.equal(val1);

            doc.cookie = val2;

            expect(doc.cookie).to.equal(val2);
        });

        it('should remove an item whose value is already expired', () => {
            const val = 'hello=world';
            doc.cookie = val;

            expect(doc.cookie).to.equal(val);

            doc.cookie = `hello=world;expires=${(new Date(1970)).toUTCString()}`;

            expect(doc.cookie).to.equal('');
        });
    });
});
