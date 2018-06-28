import {
    expect,
    use,
} from 'chai';
import 'mocha';
import {
    createSandbox,
    SinonFakeTimers,
    SinonSandbox,
    SinonSpy,
    SinonStub,
} from 'sinon';

import Document from './cookie';

use(require('sinon-chai')); // tslint:disable-line:no-var-requires


describe('Cookie', () => {
    interface SS {
        [key: string]: SinonSpy | SinonStub;
    }

    const sandbox: SinonSandbox = createSandbox();
    const ss: SS = {};
    let clock: SinonFakeTimers;
    let doc: Document;

    before(() => {
        clock = sandbox.useFakeTimers(new Date());
        ss.setTimeout = sandbox.spy(global, 'setTimeout');
    });
    afterEach(() => {
        sandbox.resetHistory();
    });
    after(() => {
        sandbox.reset();
    });

    describe('default behaviour', () => {
        before(() => {
            doc = new Document();
        });
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

            describe('"expires"', () => {
                context('when already expired', () => {
                    const expired = (new Date(1970)).toUTCString();

                    it('should remove an item whose value is now expired', () => {
                        const val = 'hello=world';
                        doc.cookie = val;

                        expect(doc.cookie, 'initial value').to.equal(val);

                        doc.cookie = `hello=world;expires=${expired}`;

                        expect(doc.cookie, 'value after overwrite').to.equal('');
                    });

                    it('should not set the item at all', () => {
                        doc.cookie = `hello=world;expires=${expired}`;

                        expect(doc.cookie).to.equal('');
                        expect(ss.setTimeout).to.not.have.been.called;
                    });
                });
            });

            describe('"max-age"', () => {
                context('when already dead', () => {
                    const dead = 0;

                    it('should remove an item whose value is already dead', () => {
                        const val = 'hello=world';
                        doc.cookie = val;

                        expect(doc.cookie, 'initial value').to.equal(val);

                        doc.cookie = `hello=world;max-age=${dead}`;

                        expect(doc.cookie, 'value after overwrite').to.equal('');
                    });

                    it('should not set an item with an initial value of dead', () => {
                        doc.cookie = `hello=world;max-age=${dead}`;

                        expect(doc.cookie).to.equal('');
                        expect(ss.setTimeout).to.not.have.been.called;
                    });
                });
            });
        });
    });

    describe('options', () => {
        context('setTimers: true', () => {
            before(() => {
                doc = new Document({
                    setTimers: true,
                });
                ss.clearTimeout = sandbox.spy(global, 'clearTimeout');
            });
            afterEach(() => {
                doc.cookie = '__VOID_BUCKET__';
            });

            function testTimerCleanup(
                pair: string,
                attr: string,
                future: number | string,
                past: number | string,
            ) {
                context('when manually removing a timed item', () => {
                    it('should clean up the timer', () => {
                        doc.cookie = `${pair};${attr}=${future}`;

                        expect(doc.cookie, 'initial value').to.equal(pair);

                        doc.cookie = `${pair};${attr}=${past}`;

                        expect(ss.clearTimeout, 'clean up timer').to.have.been.calledOnce;
                    });
                });
            }

            describe('set', () => {
                describe('"expires"', () => {
                    const future = (new Date(5000, 0)).toUTCString();
                    const past = (new Date(1970)).toUTCString();
                    const pair = 'hello=world';

                    context('when NOT yet expired', () => {
                        it('should set a timer, and then remove the item', () => {
                            doc.cookie = `${pair};expires=${future}`;

                            expect(doc.cookie, 'initial value').to.equal(pair);

                            clock.next();

                            expect(doc.cookie, 'value after expiry').to.equal('');
                        });
                    });

                    testTimerCleanup(pair, 'expires', future, past);
                });

                describe('"max-age"', () => {
                    const future = 1;
                    const past = 0;
                    const pair = 'hello=world';

                    context('when NOT yet dead', () => {
                        it('should set a timer and then remove the item', () => {
                            doc.cookie = `${pair};max-age=${future}`;

                            expect(doc.cookie, 'initial value').to.equal(pair);

                            clock.next();

                            expect(doc.cookie, 'value after aging').to.equal('');
                        });
                    });

                    testTimerCleanup(pair, 'max-age', future, past);
                });
            });
        });
    });
});
