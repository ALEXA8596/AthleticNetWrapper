"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }

const getDocument = function (text) {
  // browser
  return new DOMParser().parseFromString(text, 'text/html');
};

var _default = exports.default = getDocument;