"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getYear = year => {
  if (!year) {
    // get year
    let date = new Date();
    return year = date.getFullYear();
  } else {
    return year;
  }
};
const track = {
  team: {
    /**
     * @name GetAthletes
     * @description Gets the team athletes
     * @param {String} teamId 
     * @param {String} year 
     * @returns {Object}
     */
    GetAthletes: async function (teamId, sport = undefined, year = undefined) {
      if (!teamId) {
        return console.error("No teamId provided");
      }
      const teamCore = await this.GetTeamCore(teamId, sport, year);
      // console.log("jwt", teamCore);
      try {
        return (0, _nodeFetch.default)("https://www.athletic.net/api/v1/TeamHome/GetAthletes?seasonId=2024", {
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
    /**
     * @function GetTeamCore
     * @description Gets basic team information + JWToken
     * @param {String} teamId The team ID
     * @param {String} year 
     * @returns {Object}
     */
    GetTeamCore: async function (teamId, sport, year) {
      if (!sport) {
        // get month
        let date = new Date();
        let month = date.getMonth();
        if (month <= 6 && month >= 3) {
          sport = 'tfo';
        }
        if (month > 6) {
          sport = 'xc';
        }
        if (month < 3) {
          sport = 'tfi';
        }
      }
      if (!year) {
        // get year
        let date = new Date();
        year = date.getFullYear();
      }
      try {
        const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/TeamHome/GetTeamCore?teamId=${teamId}&sport=${sport}&year=${year}`, {
          "method": "GET"
        }).then(res => res.json());
        return response;
      } catch (e) {
        console.log(e);
        return undefined;
      }
    },
    /**
     * @function GetCalendar
     * @description Gets the meets and the calendar for a team
     * @param {String} teamId 
     * @param {String} sport 
     * @param {String} year 
     * @returns {Object}
     */
    GetCalendar: async function (teamId, sport, year) {
      if (!year) {
        // get year
        let date = new Date();
        year = date.getFullYear();
      }
      const teamCore = await this.GetTeamCore(teamId, sport, year);
      try {
        const response = await (0, _nodeFetch.default)("https://www.athletic.net/api/v1/TeamHomeCal/GetCalendar?seasonId=2024", {
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
      const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/TeamNav/Team?team=${teamId}&sport=tf&season=${year}`, {
        "headers": {},
        "body": null,
        "method": "GET"
      }).then(res => res.json());
      return response;
    },
    GetTeamEventRecords: async function (teamId, year) {
      return await this.records.GetTeamEventRecords(teamId, year);
    },
    records: {
      /**
       * @name GetTeamEventRecords
       * @description Gets the team event records for a specific year
       * @param {String} teamId 
       * @param {String} year 
       * @returns {Object}
       */
      GetTeamEventRecords: async function (teamId, year) {
        if (!year) year = getYear(year);
        const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/TeamHome/GetTeamEventRecords?teamId=${teamId}&seasonId=${year}`, {
          "headers": {},
          "body": null,
          "method": "GET"
        }).then(res => res.json());
        return response;
      },
      /**
       * @name Seasons_TeamReports
       * @description Gets the valid seasons for team reports
       * @param {String} teamId 
       * @returns {Object}
       */
      Seasons_TeamReports: async function (teamId) {
        const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/Public/Seasons_TeamReports?team=${teamId}&sport=tfo`, {
          "headers": {
            "accept": "application/json, text/plain, */*"
          },
          "body": null,
          "method": "GET"
        }).then(res => res.json());
        return response;
      },
      /**
       * @name GetTeamRecords
       * @description Gets the team / school records
       * @param {String} teamId 
       * @param {String} gender 
       * @param {String} eventShort 
       * @param {Boolean} indoor 
       * @param {Object} qParams 
       * @returns 
       */
      GetTeamRecords: async function (teamId, gender = "m", eventShort = "", indoor = false, qParams = {}) {
        if (!teamId) return undefined;
        const response = await (0, _nodeFetch.default)("https://www.athletic.net/api/v1/tfRankings/GetRankings", {
          "headers": {
            "accept": "application/json, text/plain, */*"
          },
          "body": {
            "reportType": "teamRecords",
            "teamId": teamId,
            "indoor": false,
            "eventShort": eventShort,
            "gender": gender,
            "qParams": qParams
          },
          "method": "POST"
        }).then(res => res.json());
        return response;
      }
    }
  },
  athlete: {
    /**
     * 
     * @param {*} athleteId 
     * @param {String} sport xc or tf
     * @param {*} level 0 = all, 2 = middle school, 4 = high school
     */
    GetAthleteBioData: async function (athleteId, sport, level = 0) {
      const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/AthleteBio/GetAthleteBioData?athleteId=${athleteId}&sport=${sport}&level=${level}`).then(res => res.json());
      return response;
    }
  },
  meet: {
    /**
     * @function
     * @description Get basic meet information
     * @param {String} meetId 
     * @returns {String}
     */
    GetMeetData: async function (meetId) {
      if (!meetId) return undefined;
      const response = await (0, _nodeFetch.default)(`https://www.athletic.net/api/v1/Meet/GetMeetData?meetId=${meetId}&sport=tf`, {
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
     * @description Get all the results from a meet
     * @param {String} meetId 
     * @returns {Object}
     */
    GetAllResultsData: async function (meetId) {
      const jwtMeet = await this.GetMeetData(meetId).then(res => res.jwtMeet);
      const response = (0, _nodeFetch.default)("https://www.athletic.net/api/v1/Meet/GetAllResultsData?rawResults=false&showTips=false", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "anettokens": await jwtMeet
        },
        "body": null,
        "method": "GET"
      });
      return response;
    }
  }
};
var _default = exports.default = track;