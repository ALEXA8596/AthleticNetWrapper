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
            
        }
    },
    athlete: {

    },
    meet: {

    }
}

export default crosscountry;