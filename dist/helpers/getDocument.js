"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let JSDOM;
const getDocument = typeof window !== 'undefined' && window.DOMParser ? function (text) {
  // browser
  return new DOMParser().parseFromString(text, 'text/html');
} : async function (text) {
  // Node.js environment
  if (!JSDOM) {
    /**
     * @type {import('jsdom')}
     */
    const jsdomModule = await Promise.resolve().then(() => _interopRequireWildcard(require('jsdom')));
    JSDOM = jsdomModule.JSDOM;
  }
  const dom = new JSDOM(text);
  return dom.window.document;
};
var _default = exports.default = getDocument;