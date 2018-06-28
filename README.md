# SSR Storage

This package provides a lite-weight polyfill for browser [`cookie`](https://developer.mozilla.org/en/docs/Web/API/Document/cookie) and [`WebStorage`](https://developer.mozilla.org/en/docs/Web/API/Storage) (`LocalStorage` and `SessionStorage`), exposing an identical API.

The main use-case for this is for server-side rendering of UniversalJS applications, so the application can behave normally, regardless of where it's running.

## Usage

```js
import {
    doc,
    locStorage,
    sesStorage,
} from 'ssr-storage';

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
// metadata attributes are not printed by browsers
```

### Options

#### Cookies

Name|Default|Description
---|---|---
`setTimers`|`false`|Whether to respect `expires` and `max-age` attributes with future values. When `false`, they are ignored; when `true`, the cookie will be removed when the value is reached.<br />⚠️ If set to `true`, ensure to clean up any running timers when the Request ends so they do not continue to run after their lifetime. Timer IDs are available via a non-emurable `cookieTimerIds` property on the `document` instance.

```js
import Document from 'ssr-storage/cookie';

const doc = new Document({
	// options
});

doc.cookie = 'hello=world';
doc.cookie; // 'hello=world'
```