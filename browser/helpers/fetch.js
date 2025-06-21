"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @type {globalThis.fetch | import('undici').fetch}
 */
let fetch = window.fetch.bind(window);
var _default = exports.default = fetch;