import document from './cookie';
import {
    LocalStorage,
    SessionStorage,
} from './webstorage';

export default {
    document,
    localStorage: new LocalStorage(),
    sessionStorage: new SessionStorage(),
};
