"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
async function getLiveEvents() {
  const response = await (0, _nodeFetch.default)("https://www.milesplit.com/api/v1/liveevents");
  return await response.json();
}
var _default = exports.default = getLiveEvents;