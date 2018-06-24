# SSR Storage

This package provides a lite-weight polyfill for browser [`cookie`](https://developer.mozilla.org/en/docs/Web/API/Document/cookie) and [`WebStorage`](https://developer.mozilla.org/en/docs/Web/API/Storage) (`LocalStorage` and `SessionStorage`), exposing an identical API.

The main use-case for this is for server-side rendering of UniversalJS applications, so the application can behave normally, regardless of where it's running.

## Usage

```js
import {
    document,
    localStorage,
    sessionStorage,
} from 'ssr-storage';

const browser = typeof window === 'undefined'
    ? {
        // note that it is important to use Object.create or Object.defineProperties
        // instead of something like object spread, which does not copy accessors and prototypes
        document: Object.create(document, {
            // other needed properties/methods
        }),
        localStorage,
        sessionStorage,
        // other needed properties/methods
    }
    : window;

export default browser;
```

```js
import browser from './browser';

browser.localStorage.foo = 1;
browser.localStorage.bar = 2;

browser.localStorage.foo; // 1
browser.localStorage.getItem('foo'); // 1

browser.localStorage.bar; // 2
browser.localStorage.getItem('bar'); // 2

// ---

browser.document.cookie = 'hello=world';
browser.document.cookie; // 'hello=world'

browser.document.cookie = 'qux=zed;path=/test;secure';
browser.document.cookie; // 'hello=world; qux=zed'
// the metadata-type attributes are discarded by the polyfill
// because they're irrelevant during SSR
// and are not printed by browsers anyway
```
