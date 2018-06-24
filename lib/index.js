"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("./cookie"));
const webstorage_1 = require("./webstorage");
exports.default = {
    document: cookie_1.default,
    localStorage: new webstorage_1.LocalStorage(),
    sessionStorage: new webstorage_1.SessionStorage(),
};
//# sourceMappingURL=index.js.map