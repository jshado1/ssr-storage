import Document from './cookie';
import { LocalStorage, SessionStorage, } from './webstorage';
// avoid conflicts with globals
const doc = new Document();
const locStorage = new LocalStorage();
const sesStorage = new SessionStorage();
export { doc, locStorage, sesStorage, };
//# sourceMappingURL=index.js.map