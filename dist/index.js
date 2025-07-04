"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.milesplit = exports.default = exports.athletic = void 0;
var _track = _interopRequireDefault(require("./athletic/track.js"));
var _crosscountry = _interopRequireDefault(require("./athletic/crosscountry.js"));
var _search = _interopRequireDefault(require("./athletic/search.js"));
var _home = _interopRequireDefault(require("./milesplit/home.js"));
var _search2 = require("./milesplit/search.js");
var _rankings = _interopRequireDefault(require("./milesplit/rankings.js"));
var _meet = require("./milesplit/meet.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const athletic = exports.athletic = {
  track: _track.default,
  crosscountry: _crosscountry.default,
  search: _search.default
};
const milesplit = exports.milesplit = {
  meets: {
    getMeets: _meet.getMeets,
    getPerformances: _meet.getPerformances,
    getMeetData: _meet.getMeetData,
    getResultFileList: _meet.getResultFileList,
    getAllResultsData: _meet.getAllResultsData,
    getRawPerformances: _meet.getRawPerformances
  },
  rankings: _rankings.default,
  search: {
    getSearchToken: _search2.getSearchToken,
    fetchTeams: _search2.fetchTeams,
    fetchAthletes: _search2.fetchAthletes
  },
  home: {
    getLiveEvents: _home.default
  }
};
var _default = exports.default = {
  athletic,
  milesplit
};