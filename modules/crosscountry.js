import fetch from 'node-fetch';

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
            if(!teamId) return undefined;
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
            if(!teamId) return undefined;
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
            if(!teamId) return undefined;
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
                var dom = new JSDOM(response);
                var window = dom.window;
                var document = window.document;

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
                var dom = new JSDOM(response);
                var window = dom.window;
                var document = window.document;

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

    },
    meet: {

    }
}

export default crosscountry;