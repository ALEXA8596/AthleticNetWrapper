"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }

const getDocument = function (text) {
  // browser
  return new DOMParser().parseFromString(text, 'text/html');
}

/**
 * @function getYear
 * @param {String} year 
 * @returns {String} year
 */
const getYear = year => {
  if (!year) {
    // get year
    let date = new Date();
    return year = date.getFullYear();
  } else {
    return year;
  }
};
const crosscountry = {
  team: {
    /**
     * @name GetTeam
     * @description Gets basic team information
     * @param {String} teamId 
     * @param {String} year 
     * @returns {Object}
     */
    Team: async function (teamId, year) {
      if (!year) {
        // get year
        let date = new Date();
        year = date.getFullYear();
      }
      const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/TeamNav/Team?team=${teamId}&sport=xc&season=${year}`, {
        "headers": {},
        "body": null,
        "method": "GET"
      }).then(res => res.json());
      return response;
    },
    /**
     * @name GetTeamCore
     * @description Gets basic team information + JWToken
     * @param {String} teamId The team ID
     * @param {String} year 
     * @returns {Object}
     */
    GetTeamCore: async function (teamId, year = null) {
      if (!teamId) return undefined;
      year = getYear(year);
      try {
        const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/TeamHome/GetTeamCore?teamId=${teamId}&sport=xc&year=${year}`, {
          "method": "GET"
        }).then(res => res.json());
        return response;
      } catch (e) {
        console.log(e);
        return undefined;
      }
    },
    /**
     * @name GetCalendar
     * @description Gets the team (meet) calendar
     * @param {String} teamId 
     * @param {String} year 
     * @returns {Object}
     */
    GetCalendar: async function (teamId, year = null) {
      if (!teamId) return undefined;
      year = getYear(year);
      const teamCore = await this.GetTeamCore(teamId, year);
      try {
        const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/TeamHomeCal/GetCalendar?seasonId=${year}`, {
          "headers": {
            "anettokens": await teamCore.jwtTeamHome
          },
          "body": null,
          "method": "GET"
        }).then(res => res.json());
        return response;
      } catch (e) {
        console.log(e);
        return undefined;
      }
    },
    /**
     * @name GetAthletes
     * @description Gets the team athletes
     * @param {String} teamId 
     * @param {String} year 
     * @returns {Object}
     */
    GetAthletes: async function (teamId, year = null) {
      if (!teamId) return undefined;
      year = getYear(year);
      const teamCore = await this.GetTeamCore(teamId, year);
      try {
        return (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/TeamHome/GetAthletes?seasonId=${year}`, {
          "headers": {
            "anettokens": await teamCore.jwtTeamHome
          },
          "body": null,
          "method": "GET"
        }).then(res => res.text());
      } catch (e) {
        console.log(e);
      }
    },
    records: {
      seasonBests: async function (teamId, year = "") {
        const response = await (0, _nodeFetch.default)(`https://www.athletic.net/CrossCountry/seasonbest?SchoolID=${teamId}&S=${year}`, {
          "headers": {},
          "body": null,
          "method": "GET"
        }).then(res => res.text());
        var document = await getDocument(response);
        const data = {};
        const divs = document.getElementsByClassName("distance");
        for (let i = 0; i < divs.length; i++) {
          const element = divs[i];
          const distanceLabel = element.getElementsByTagName("h3")[0];
          if (distanceLabel.getElementsByTagName("span").length > 0) distanceLabel.getElementsByTagName("span")[0].remove();
          const distance = distanceLabel.textContent;
          const maleTable = element.getElementsByClassName("M")[0].getElementsByTagName("table")[0];
          const femaleTable = element.getElementsByClassName("F")[0].getElementsByTagName("table")[0];

          // get maleTable rows
          if (maleTable) {
            const maleTableRows = maleTable.getElementsByTagName("tr");
            if (maleTableRows.length > 0) {
              const maleRecords = [];
              for (let i = 0; i < maleTableRows.length; i++) {
                const row = maleTableRows[i];
                [...row.getElementsByTagName("span")].forEach(element => element.remove());
                [...row.getElementsByTagName("small")].forEach(element => element.remove());
                const cells = row.getElementsByTagName("td");
                const record = {
                  place: cells[0].textContent,
                  grade: cells[1].textContent,
                  name: cells[2].textContent,
                  time: cells[3].textContent,
                  date: cells[4].textContent,
                  meet: cells[5].textContent,
                  athleteUrl: cells[2].getElementsByTagName("a")[0].href,
                  resultUrl: cells[3].getElementsByTagName("a")[0].href,
                  meetUrl: cells[5].getElementsByTagName("a")[0].href
                };
                maleRecords.push(record);
              }
              ;
              if (!data[distance]) {
                data[distance] = {};
              }
              data[distance]["boys"] = maleRecords;
            }
          }
          ;
          if (femaleTable) {
            const femaleTableRows = femaleTable.getElementsByTagName("tr");
            if (femaleTableRows.length > 0) {
              const femaleRecords = [];
              for (let i = 0; i < femaleTableRows.length; i++) {
                const row = femaleTableRows[i];
                [...row.getElementsByTagName("span")].forEach(element => element.remove());
                [...row.getElementsByTagName("small")].forEach(element => element.remove());
                const cells = row.getElementsByTagName("td");
                const record = {
                  place: cells[0].textContent,
                  grade: cells[1].textContent,
                  name: cells[2].textContent,
                  time: cells[3].textContent,
                  date: cells[4].textContent,
                  meet: cells[5].textContent,
                  athleteUrl: cells[2].getElementsByTagName("a")[0].href,
                  resultUrl: cells[3].getElementsByTagName("a")[0].href,
                  meetUrl: cells[5].getElementsByTagName("a")[0].href
                };
                femaleRecords.push(record);
              }
              ;
              if (!data[distance]) {
                data[distance] = {};
              }
              data[distance]["girls"] = femaleRecords;
            }
          }
        }
        return data;
      },
      TeamRecords: async function (teamId) {
        const response = await (0, _nodeFetch.default)(`https://www.athletic.net/CrossCountry/TeamRecords.aspx?SchoolID=${teamId}`, {
          "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
          }
        }).then(res => res.text());
        var document = await getDocument(response);
        const data = {};
        const divs = document.getElementsByClassName("distance");
        for (let i = 0; i < divs.length; i++) {
          const element = divs[i];
          const distanceLabel = element.getElementsByTagName("h3")[0];
          distanceLabel.getElementsByTagName("span")[0].remove();
          const distance = distanceLabel.textContent;
          const maleTable = element.getElementsByClassName("M")[0].getElementsByTagName("table")[0];
          const femaleTable = element.getElementsByClassName("F")[0].getElementsByTagName("table")[0];

          // get maleTable rows
          if (maleTable) {
            const maleTableRows = maleTable.getElementsByTagName("tr");
            if (maleTableRows.length > 0) {
              const maleRecords = [];
              for (let i = 0; i < maleTableRows.length; i++) {
                const row = maleTableRows[i];
                [...row.getElementsByTagName("span")].forEach(element => element.remove());
                [...row.getElementsByTagName("small")].forEach(element => element.remove());
                const cells = row.getElementsByTagName("td");
                const record = {
                  place: cells[0].textContent,
                  grade: cells[1].textContent,
                  name: cells[2].textContent,
                  time: cells[3].textContent,
                  meet: cells[4].textContent,
                  athleteUrl: cells[2].getElementsByTagName("a")[0].href,
                  resultUrl: cells[3].getElementsByTagName("a")[0].href
                };
                maleRecords.push(record);
              }
              ;
              if (!data[distance]) {
                data[distance] = {};
              }
              data[distance]["boys"] = maleRecords;
            }
          }
          ;
          if (femaleTable) {
            const femaleTableRows = femaleTable.getElementsByTagName("tr");
            if (femaleTableRows.length > 0) {
              const femaleRecords = [];
              for (let i = 0; i < femaleTableRows.length; i++) {
                const row = femaleTableRows[i];
                [...row.getElementsByTagName("span")].forEach(element => element.remove());
                [...row.getElementsByTagName("small")].forEach(element => element.remove());
                const cells = row.getElementsByTagName("td");
                const record = {
                  place: cells[0].textContent,
                  grade: cells[1].textContent,
                  name: cells[2].textContent,
                  time: cells[3].textContent,
                  date: cells[4].textContent,
                  athleteUrl: cells[2].getElementsByTagName("a")[0].href,
                  resultUrl: cells[3].getElementsByTagName("a")[0].href
                };
                femaleRecords.push(record);
              }
              ;
              if (!data[distance]) {
                data[distance] = {};
              }
              data[distance]["girls"] = femaleRecords;
            }
          }
        }
        return data;
      }
    }
  },
  athlete: {
    /**
     * @description Get the bio data for an athlete
     * @param {String} athleteId 
     * @param {Number} level 
     * @returns {Object}
     */
    GetAthleteBioData: async function (athleteId, level = 0) {
      if (!athleteId) return undefined;
      const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/AthleteBio/GetAthleteBioData?athleteId=${athleteId}&sport=xc&level=${level}`, {
        "headers": {
          "accept": "application/json, text/plain, */*"
        },
        "body": null,
        "method": "GET"
      }).then(res => res.json());
      return response;
    },
    /**
     * @function 
     * @description Get the rankings for an athlete
     * @param {String} athleteId 
     * @param {String} seasonId 
     * @returns {Object} response
     */
    GetRankings: async function (athleteId, seasonId) {
      seasonId = getYear(seasonId);
      if (!athleteId) return undefined;
      const response = (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/General/GetRankings?athleteId=${athleteId}&sport=xc&seasonId=${seasonId}&truncate=false`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      }).then(res => res.json());
      return response;
    }
  },
  meet: {
    /**
     * @function GetMeetData
     * @description Obtains basic meet data + JWToken for the meet
     * @param {String} meetId 
     * @returns {Object} response
     */
    GetMeetData: async function (meetId) {
      const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/Meet/GetMeetData?meetId=${meetId}&sport=xc`, {
        "headers": {
          "accept": "application/json, */*"
        },
        "body": null,
        "method": "GET"
      }).then(res => res.json());
      return response;
    },
    /**
     * @function GetAllResultsData
     * @description Obtains all results data for a meet
     * @param {String} meetId 
     * @returns {Object} response
     */
    GetAllResultsData: async function (meetId) {
      if (!meetId) return undefined;
      // maybe add a delay to prevent rate limiting

      const meetData = await crosscountry.meet.GetMeetData(meetId);
      const data = {};
      const races = meetData.xcDivisions;
      await Promise.all(races.map(async race => {
        const response = await crosscountry.meet.GetResultsData(meetId, race.IDMeetDiv);
        data[race.IDMeetDiv] = response;
      }));
      return data;
    },
    /**
     * @function GetResultsData
     * @description Gets the results of a Cross Country race
     * @description This api changes frequently. Changing the succeeding # to a different number may work
     * @param {String} meetId 
     * @param {String} raceId 
     * @returns {Object}
     */
    GetResultsData: async function (meetId, raceId) {
      if (!meetId || !raceId) return undefined;
      const response = await (0, _nodeFetch.default)("https://www.athletic.net/api/v1/Meet/GetResultsData3", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "anettokens": await crosscountry.meet.GetMeetData(meetId).then(res => res.jwtMeet),
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          "divId": raceId
        }),
        "method": "POST"
      }).then(res => res.json());
      return response;
    },
    /**
     * @function GetIndividualRaceResults
     * @description A shortcut for GetResultsData
     * @param {String} meetId 
     * @param {String} raceId 
     * @returns {Object}
     */
    GetIndividualRaceResults: async (meetId, raceId) => {
      return await crosscountry.meet.GetResultsData(meetId, raceId);
    },
    /**
     * @function GetXCMoreData
     * @description Gets meets that take place at the same location, as well as division rankings.
     * @param {*} meetId 
     * @returns 
     */
    GetXCMoreData: async function (meetId) {
      const response = await (0, _nodeFetch.default)("https://www.athletic.net/api/v1/Meet/GetXCMoreData", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "anettokens": await crosscountry.meet.GetMeetData(meetId).then(res => res.jwtMeet)
        },
        "body": null,
        "method": "GET"
      }).then(res => res.json());
      return response;
    }
  },
  GetUncategorizedTeams: async function () {
    const response = await (0, _nodeFetch.default)("https://www.athletic.net/api/v1/DivisionHome/GetUncategorizedTeams?sport=xc&divisionId=73596", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9"
      },
      "body": null,
      "method": "GET"
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error("Request failed");
  },
  GetTree: async function () {
    const response = await (0, _nodeFetch.default)("https://www.athletic.net/api/v1/DivisionHome/GetTree?sport=xc&divisionId=73596&depth=1&includeTeams=false", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9"
      },
      "body": null,
      "method": "GET"
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error("Request failed");
  },
  GetDivisions: async function () {
    const response = await (0, _nodeFetch.default)("https://www.athletic.net/api/v1/DivisionHome/GetDivisions?sport=xc&L0=&L1=&L2=&L3=&L4=&L5=&year=0&divId=73596", {
      "headers": {
        "accept": "application/json, text/plain, */*"
      },
      "body": null,
      "method": "GET"
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error("Request failed");
  }
};
var _default = exports.default = crosscountry;