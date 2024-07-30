import fetch from 'node-fetch';

getYear = (year) => {
    if (!year) {
        // get year
        let date = new Date();
        return year = date.getFullYear();
    } else {
        return year;
    }
}

const track = {
    team: {
        GetAthletes: async function (teamId, sport = undefined, year = undefined) {
            if (!teamId) {
                return console.error("No teamId provided");
            }
            const teamCore = await this.GetTeamCore(teamId, sport, year);
            // console.log("jwt", teamCore);
            try {
                return fetch("https://www.athletic.net/api/v1/TeamHome/GetAthletes?seasonId=2024", {
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
                const response = await fetch(`https://www.athletic.net/api/v1/TeamHome/GetTeamCore?teamId=${teamId}&sport=${sport}&year=${year}`, {
                    "method": "GET"
                }).then(res => res.json());
                return response;
            } catch (e) {
                console.log(e);
                return undefined;
            }
        },
        GetCalendar: async function (teamId, sport, year) {
            if (!year) {
                // get year
                let date = new Date();
                year = date.getFullYear();
            }
            const teamCore = await this.GetTeamCore(teamId, sport, year);
            try {
                const response = await fetch("https://www.athletic.net/api/v1/TeamHomeCal/GetCalendar?seasonId=2024", {
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
         * 
         * @param {String} teamId 
         * @param {String} sport xc or tf
         * @param {String} year 
         * @returns 
         */
        Team: async function (teamId, year) {
            if (!year) {
                // get year
                let date = new Date();
                year = date.getFullYear();
            }
            const response = await fetch(`https://www.athletic.net/api/v1/TeamNav/Team?team=${teamId}&sport=tf&year=${year}`, {
                "headers": {
                },
                "body": null,
                "method": "GET"
            }).then(res => res.json());
            return response;
        },
        GetTeamEventRecords: async function (teamId, year) {
            if (!year) year = getYear(year);
            const response = await fetch(`https://www.athletic.net/api/v1/TeamHome/GetTeamEventRecords?teamId=${teamId}&seasonId=${year}`, {
                "headers": {
                },
                "body": null,
                "method": "GET"
            }).then(res => res.json());
            return response;
        },
    },
    athlete: {
        /**
         * 
         * @param {*} athleteId 
         * @param {String} sport xc or tf
         * @param {*} level 0 = all, 2 = middle school, 4 = high school
         */
        getAthleteBioData: async function (athleteId, sport, level = 0) {
            const response = await fetch(`https://www.athletic.net/api/v1/AthleteBio/GetAthleteBioData?athleteId=${athleteId}&sport=${sport}&level=${level}`).then(res => res.json());
            return response;
        }
    },
    meet: {

    }
};

export default track;