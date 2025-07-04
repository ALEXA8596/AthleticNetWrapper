"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllResultsData = getAllResultsData;
exports.getMeetData = getMeetData;
exports.getMeets = getMeets;
exports.getPerformances = getPerformances;
exports.getRawPerformances = getRawPerformances;
exports.getResultFileList = getResultFileList;
var _getDocument = _interopRequireDefault(require("../helpers/getDocument"));
var _fetch = _interopRequireDefault(require("../helpers/fetch"));
var cookie = _interopRequireWildcard(require("cookie"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const month = {
  "": "",
  January: "1",
  February: "2",
  March: "3",
  April: "4",
  May: "5",
  June: "6",
  July: "7",
  August: "8",
  September: "9",
  October: "10",
  November: "11",
  December: "12"
};
const year = {
  "": "",
  2025: "2025",
  2024: "2024",
  2023: "2023",
  2022: "2022",
  2021: "2021",
  2020: "2020",
  2019: "2019",
  2018: "2018",
  2017: "2017",
  2016: "2016",
  2015: "2015",
  2014: "2014",
  2013: "2013",
  2012: "2012",
  2011: "2011",
  2010: "2010",
  2009: "2009",
  2008: "2008",
  2007: "2007",
  2006: "2006"
};
const level = {
  All: "",
  Youth: "youth",
  "Middle School": "ms",
  "High School": "hs",
  College: "college",
  Open: "open",
  "Pro/Elite": "pro"
};
async function getMeets(season, level, state, month, year) {
  // https://www.milesplit.com/results/?season=cc&level=all&page=2?&month=9&year=2024
  const params = new URLSearchParams();
  if (season) params.append("season", season);
  if (level && level !== "All") params.append("level", level);
  if (state) params.append("state", state);
  if (month && month !== "") params.append("month", month);
  if (year && year !== "") params.append("year", year);
  const queryString = params.toString();
  const url = `https://www.milesplit.com/results/?${queryString}`;
  // console.log("Fetching meets from URL:", url);
  const response = await (0, _fetch.default)(url);
  if (!response.ok) {
    throw new Error(`Error fetching meets: ${response.statusText}`);
  }
  return await response.text();
}
let uniqueId;
let appHash;

/**
 * 
 * @param {String} meetId 
 * @param {String} resultsId 
 * @param {import("undici").RequestInfo} settings 
 * @returns 
 */
async function getRawPerformances(meetId, resultsId, settings) {
  async function getAppHashAndUniqueId() {
    if (uniqueId && appHash) return {
      uniqueId,
      appHash
    };
    const res = await (0, _fetch.default)("https://milesplit.com/meets/" + meetId + "/results/" + resultsId + "/formatted/", {
      ...settings
    });
    const headers = await res.headers;
    const setCookieHeader = headers.get("set-cookie");
    // console.log(setCookieHeader)
    if (setCookieHeader) {
      const parsed = cookie.parse(setCookieHeader);
      uniqueId = parsed.unique_id;
    }
    const text = await res.text();
    const match = text.match(/appHash:\s*'([^']+)'/);
    if (!match) {
      throw new Error("appHash not found");
    }
    return {
      appHash: match[1],
      uniqueId
    };
  }
  const url = "https://milesplit.com/api/v1/meets/" + meetId + "/performances?isMeetPro=0&resultsId=" + resultsId + "&fields=id%2CmeetId%2CmeetName%2CteamId%2CvideoId%2CteamName%2CathleteId%2CfirstName%2ClastName%2Cgender%2CgenderName%2CdivisionId%2CdivisionName%2CmeetResultsDivisionId%2CresultsDivisionId%2CageGroupName%2CgradYear%2CeventName%2CeventCode%2CeventDistance%2CeventGenreOrder%2Cround%2CroundName%2Cheat%2Cunits%2Cmark%2Cplace%2CwindReading%2CprofileUrl%2CteamProfileUrl%2CperformanceVideoId%2CteamLogo%2CstatusCode&m=GET";
  const AppHashAndUniqueId = await getAppHashAndUniqueId();
  const response = await (0, _fetch.default)(url, {
    ...settings,
    headers: {
      Accept: "*/*",
      cookie: `unique_id=${AppHashAndUniqueId.uniqueId};`
    },
    method: "GET",
    body: null
  });
  if (!response.ok) {
    console.log(await response.text());
    throw new Error(`Error fetching performances: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * 
 * @param {String} meetId 
 * @param {String} resultsId 
 * @param {String | null} resultFileName 
 * @param {import("undici").RequestInfo} settings 
 * @returns 
 */
async function getPerformances(meetId, resultsId, resultFileName = null, settings) {
  const rawPerformances = await getRawPerformances(meetId, resultsId, settings);

  // rawPerformances contains a data object, which is an array of all the individual performances combined. Sort them by (resultsDivisionId || divisionName || divisionId), eventCode, then gender in a hierarchy JSON
  const performances = rawPerformances.data || [];
  const hierarchy = {};
  for (const perf of performances) {
    const divisionKey = resultFileName || perf.resultsDivisionId || perf.divisionName || perf.divisionId || "Unknown";
    if (!hierarchy[divisionKey]) hierarchy[divisionKey] = {};
    if (!hierarchy[divisionKey][perf.eventCode]) hierarchy[divisionKey][perf.eventCode] = {};
    if (!hierarchy[divisionKey][perf.eventCode][perf.gender]) hierarchy[divisionKey][perf.eventCode][perf.gender] = [];
    hierarchy[divisionKey][perf.eventCode][perf.gender].push(perf);
  }
  return hierarchy;
}
/**
 *
 * @param {String | Number} meetId can be either just the numerical id or the whole title
 */
async function getMeetData(meetId) {
  const res = await (0, _fetch.default)(`https://milesplit.com/meets/${meetId}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
  }).then(res => res.text());
  const document = await (0, _getDocument.default)(res);

  // Find the <script type="application/ld+json"> tag and parse its contents as JSON
  const script = document.querySelector('script[type="application/ld+json"]');
  let schema = null;
  if (script) {
    try {
      schema = JSON.parse(script.textContent);
    } catch (e) {
      console.error("Failed to parse schema.org JSON:", e);
    }
  }
  return schema;
}
/**
 *
 * @param {String | Number} meetId can be either just the numerical id or the whole title
 * @param {import("undici").RequestInfo} settings
 */
async function getResultFileList(meetId, settings = {}) {
  const res = await (0, _fetch.default)(`https://milesplit.com/meets/${meetId}/results`, {
    ...settings,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
  }).then(res => res.text());
  const document = await (0, _getDocument.default)(res);
  if (document.getElementsByClassName("empty") && Array.from(document.getElementsByClassName("empty")) > 0) {
    return null;
  }

  /**
   * @type {Element}
   */
  const resultFileList = document.getElementById("resultFileList");
  if (!resultFileList) {
    return null;
  }
  const resultsIds = Array.from(resultFileList.querySelectorAll("a")).map(el => {
    const parts = el.href.split("/");
    return {
      name: el.textContent,
      id: parts[parts.length - 3]
    };
  });
  return resultsIds;
}
async function getAllResultsData(meetId, settings) {
  const resultFileList = await getResultFileList(meetId, settings);
  if (resultFileList == null) {
    return null;
  }
  const results = await Promise.all(resultFileList.map(async resultFile => {
    return await getPerformances(meetId, resultFile.id, resultFile.name, settings);
  }));
  return results;
}