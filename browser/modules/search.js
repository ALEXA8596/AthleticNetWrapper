"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let JSDOM;
const getDocument = function (text) {
  // browser
  return new DOMParser().parseFromString(text, 'text/html');
}

function removeTrailingWhitespace(string) {
  return string.replace(/\s+$/, '');
}

const search = {
  AutoComplete: async function (query) {
    const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/AutoComplete/search?q=${query}&fq=`).then(res => res.json());
    return response;
  },
  /**
   * 
   * @param {*} query 
   * @param {*} fq 
   * level (l) : high school: 4 middle school: 2, college: 8, club: 16
   * sport (a) : xc || tf
   * type (m): team: t, athlete: a, meet: m
   * @example fq = "l:4 a:xc m:t"
   * @returns 
   */
  runSearch: async function (query, fq) {
    const response = await (0, _nodeFetch.default)("https://www.athletic.net/Search.aspx/runSearch", {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/json",
        "mode": "cors"
      },
      "body": JSON.stringify({
        q: query,
        start: 0,
        fq: fq || ""
      }),
      "method": "POST"
    }).then(async res => await res.json());
    var document = await getDocument("<table>" + response.d.results + "</table>");
    [...document.getElementsByTagName('i')].forEach(element => element.remove());
    [...document.getElementsByClassName('sportIcon')].forEach(element => element.remove());
    [...document.getElementsByTagName('span')].forEach(element => element.remove());
    const tableRows = document.getElementsByTagName("tr");
    const info = [];
    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];
      const firstUrl = row.getElementsByTagName("a")[0];
      if (!firstUrl) {
        continue;
      }
      const url = firstUrl.href;
      if (url.includes("/athlete/")) {
        const athlete = {
          name: firstUrl.textContent,
          url: "https://athletic.net/" + firstUrl.href,
          id: url.split("/")[2],
          school: row.getElementsByClassName("small")[0].children[1].textContent
        };
        info.push(athlete);
      } else if (url.includes("/team/")) {
        const team = {
          name: row.getElementsByClassName("result-title-tf")[0].textContent,
          url: "https://athletic.net/" + row.getElementsByTagName("a")[1].href,
          id: row.getElementsByClassName("result-title-tf")[0].href.split("/")[2]
        };
        info.push(team);
      } else if (url.includes("/meet/")) {
        // console.log(row.outerHTML);
        const meet = {
          name: row.getElementsByTagName("a")[1].textContent.trim(),
          url: "https://athletic.net/" + row.getElementsByTagName("a")[1].href,
          id: row.getElementsByTagName("a")[1].href.split("/").pop()
        };
        info.push(meet);
      }
    }
    return {
      responses: info,
      editedDom: document.body.innerHTML,
      raw: response
    };
  }
};
var _default = exports.default = search;