import fetch from 'node-fetch';
import { DOMParser } from '@xmldom/xmldom';
/**
 * @function getYear
 * @param {String} year 
 * @returns {String} year
 */
const getYear = (year) => {
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
            const response = await fetch(`https://www.athletic.net/api/v1/TeamNav/Team?team=${teamId}&sport=xc&year=${year}`, {
                "headers": {
                },
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
                const response = await fetch(`https://www.athletic.net/api/v1/TeamHome/GetTeamCore?teamId=${teamId}&sport=xc&year=${year}`, {
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
                const response = await fetch(`https://www.athletic.net/api/v1/TeamHomeCal/GetCalendar?seasonId=${year}`, {
                    "headers": {
                        "anettokens": await teamCore.jwtTeamHome,
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
                return fetch(`https://www.athletic.net/api/v1/TeamHome/GetAthletes?seasonId=${year}`, {
                    "headers": {
                        "anettokens": await teamCore.jwtTeamHome,
                    },
                    "body": null,
                    "method": "GET"
                }).then(res => res.text());
            }
            catch (e) {
                console.log(e);
            }
        },
        records: {
            seasonBests: async function (teamId, year = "") {
                const response = await fetch(`https://www.athletic.net/CrossCountry/seasonbest?SchoolID=${teamId}&S=${year}`, {
                    "headers": {
                    },
                    "body": null,
                    "method": "GET"
                }).then(res => res.text());
                var document = new DOMParser().parseFromString(response, 'text/html');

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
                                [...row.getElementsByTagName("span")].forEach((element) => element.remove());
                                [...row.getElementsByTagName("small")].forEach((element) => element.remove());
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
                                    meetUrl: cells[5].getElementsByTagName("a")[0].href,
                                };
                                maleRecords.push(record);
                            };
                            if (!data[distance]) {
                                data[distance] = {};
                            }
                            data[distance]["boys"] = maleRecords;
                        }
                    };
                    if (femaleTable) {
                        const femaleTableRows = femaleTable.getElementsByTagName("tr");
                        if (femaleTableRows.length > 0) {
                            const femaleRecords = [];

                            for (let i = 0; i < femaleTableRows.length; i++) {
                                const row = femaleTableRows[i];
                                [...row.getElementsByTagName("span")].forEach((element) => element.remove());
                                [...row.getElementsByTagName("small")].forEach((element) => element.remove());
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
                                    meetUrl: cells[5].getElementsByTagName("a")[0].href,
                                };
                                femaleRecords.push(record);
                            };
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
                const response = await fetch(`https://www.athletic.net/CrossCountry/TeamRecords.aspx?SchoolID=${teamId}`, {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    },
                }).then(res => res.text());
                var document = new DOMParser().parseFromString(response, 'text/html');
                
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
                                [...row.getElementsByTagName("span")].forEach((element) => element.remove());
                                [...row.getElementsByTagName("small")].forEach((element) => element.remove());
                                const cells = row.getElementsByTagName("td");
                                const record = {
                                    place: cells[0].textContent,
                                    grade: cells[1].textContent,
                                    name: cells[2].textContent,
                                    time: cells[3].textContent,
                                    meet: cells[4].textContent,
                                    athleteUrl: cells[2].getElementsByTagName("a")[0].href,
                                    resultUrl: cells[3].getElementsByTagName("a")[0].href,
                                };
                                maleRecords.push(record);
                            };
                            if (!data[distance]) {
                                data[distance] = {};
                            }
                            data[distance]["boys"] = maleRecords;
                        }
                    };
                    if (femaleTable) {
                        const femaleTableRows = femaleTable.getElementsByTagName("tr");
                        if (femaleTableRows.length > 0) {
                            const femaleRecords = [];

                            for (let i = 0; i < femaleTableRows.length; i++) {
                                const row = femaleTableRows[i];
                                [...row.getElementsByTagName("span")].forEach((element) => element.remove());
                                [...row.getElementsByTagName("small")].forEach((element) => element.remove());
                                const cells = row.getElementsByTagName("td");
                                const record = {
                                    place: cells[0].textContent,
                                    grade: cells[1].textContent,
                                    name: cells[2].textContent,
                                    time: cells[3].textContent,
                                    date: cells[4].textContent,
                                    athleteUrl: cells[2].getElementsByTagName("a")[0].href,
                                    resultUrl: cells[3].getElementsByTagName("a")[0].href,
                                };
                                femaleRecords.push(record);
                            };
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
            const response = await fetch(`https://www.athletic.net/api/v1/AthleteBio/GetAthleteBioData?athleteId=${athleteId}&sport=xc&level=${level}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
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
            const response = fetch(`https://www.athletic.net/api/v1/General/GetRankings?athleteId=${athleteId}&sport=xc&seasonId=${seasonId}&truncate=false`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "anet-appinfo": "web:web:0:420",
                    "pageguid": "9e3374ce-5968-4535-b1bf-235e2b469181",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "cookie": "__stripe_mid=5aae35e4-5c1c-46e1-9172-3077bf13ce7d60cd9b; _au_1d=AU1D-0100-001710387210-H8U3O4ST-GXBB; __stripe_sid=1fc0fe12-78fd-4614-8d8e-3312cd209a9e7c7e20; ANETSettings=Team=1934&Sport=XC&guid=18eb6e92-45b1-400d-bdde-83c3655dd92d&User=1989871",
                    "Referer": "https://www.athletic.net/athlete/26122795/cross-country/all",
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
            const response = await fetch(`https://www.athletic.net/api/v1/Meet/GetMeetData?meetId=${meetId}&sport=xc`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
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

            const meetData = await this.GetMeetData(meetId);

            const data = {};

            const races = meetData.xcDivisions;

            await Promise.all(
                races.map(race => {
                    const response = this.GetResultsData2(meetId, race.IDMeetDiv);
                    data[race.IDMeetDiv] = response;
                }));

            return data;
        },
        /**
         * @function GetResultsData2
         * @description Gets the results of a Cross Country race
         * @param {String} meetId 
         * @param {String} raceId 
         * @returns {Object}
         */
        GetResultsData2: async function (meetId, raceId) {
            if (!meetId || !raceId) return undefined;
            const response = await fetch("https://www.athletic.net/api/v1/Meet/GetResultsData2", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "anettokens": await this.GetMeetData(meetId).then(res => res.jwtMeet),
                },
                "body": {
                    "divId": raceId
                },
                "method": "POST"
            });
            return response;
        },
        /**
         * @function GetIndividualRaceResults
         * @description A shortcut for GetResultsData2
         * @param {String} meetId 
         * @param {String} raceId 
         * @returns {Object}
         */
        GetIndividualRaceResults: async (meetId, raceId) => {
            return await this.crossCountry.meet.GetResultsData2(meetId, raceId);
        },
        /**
         * @function GetXCMoreData
         * @description Gets meets that take place at the same location, as well as division rankings.
         * @param {*} meetId 
         * @returns 
         */
        GetXCMoreData: async function (meetId) {
            const response = await fetch("https://www.athletic.net/api/v1/Meet/GetXCMoreData", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "anettokens": await this.GetMeetData(meetId).then(res => res.jwtMeet),
                },
                "body": null,
                "method": "GET"
            }).then(res => res.json());
            return response;
        },
    }
}

export default crosscountry;