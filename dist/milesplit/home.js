"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fetch = _interopRequireDefault(require("../helpers/fetch"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
async function getLiveEvents() {
  const response = await (0, _fetch.default)("https://www.milesplit.com/api/v1/liveevents");
  return await response.json();
}
var _default = exports.default = getLiveEvents;