import * as ssrStorage from '../lib/es/index';

const {
    doc,
    locStorage,
    sesStorage,
} = ssrStorage;

const browser = typeof window === 'undefined'
    ? {
        // note that it is important to use Object.create or Object.defineProperties
        // instead of something like object spread, which does not copy accessors and prototypes
        document: Object.create(doc, {
            // other needed methods and properties
        }),
        localStorage: locStorage,
        sessionStorage: sesStorage,
        // other needed properties/methods
    }
    : window;

browser.localStorage.foo = 1;
browser.localStorage.bar = 2;

console.log('localStorage getter (foo):', browser.localStorage.foo);
console.log('localStorage getItem (foo):', browser.localStorage.getItem('foo'));

console.log('localStorage getter (bar):', browser.localStorage.bar);
console.log('localStorage getItem (bar):', browser.localStorage.getItem('bar'));

// ---

browser.document.cookie = 'hello=world';
console.log('cookie first:', browser.document.cookie);

browser.document.cookie = 'qux=zed;path=/test;secure';
console.log('cookie second (with meta attributes):', browser.document.cookie);
