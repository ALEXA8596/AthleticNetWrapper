"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const fetch = require('node-fetch');
var _default = exports.default = {
  getLiveEvents: async function () {
    const response = await fetch("https://www.milesplit.com/api/v1/liveevents");
    return await response.json();
  }
};