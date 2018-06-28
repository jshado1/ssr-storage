"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("./cookie"));
const webstorage_1 = require("./webstorage");
// avoid conflicts with globals
const doc = new cookie_1.default();
exports.doc = doc;
const locStorage = new webstorage_1.LocalStorage();
exports.locStorage = locStorage;
const sesStorage = new webstorage_1.SessionStorage();
exports.sesStorage = sesStorage;
//# sourceMappingURL=index.js.map