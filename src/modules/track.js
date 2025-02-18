import fetch from 'node-fetch';

const getYear = (year) => {
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
                const response = await fetch(`https://www.athletic.net/api/v1/TeamHome/GetTeamCore?teamId=${teamId}&sport=${sport}&year=${year}`, {
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
            const response = await fetch(`https://www.athletic.net/api/v1/TeamNav/Team?team=${teamId}&sport=tf&season=${year}`, {
                "headers": {
                },
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
                const response = await fetch(`https://www.athletic.net/api/v1/TeamHome/GetTeamEventRecords?teamId=${teamId}&seasonId=${year}`, {
                    "headers": {
                    },
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
                const response = await fetch(`https://www.athletic.net/api/v1/Public/Seasons_TeamReports?team=${teamId}&sport=tfo`, {
                    "headers": {
                        "accept": "application/json, text/plain, */*",
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
            GetTeamRecords: async function (teamId, gender = "m", eventShort = "", indoor = null, qParams = {}) {
                if(!teamId) return undefined;
                const response = await fetch("https://www.athletic.net/api/v1/tfRankings/GetRankings", {
                    "headers": {
                        "accept": "application/json, */*",
                        "content-type": "application/json",
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
            },
            GetTeamAthleteRecords: async function (teamId, seasonId) {
                // fetch("https://www.athletic.net/api/v1/TeamHome/GetTeamAthleteRecords?teamId=1067&seasonId=2024", {
                //     "headers": {
                //       "accept": "application/json, text/plain, */*",
                //       "accept-language": "en-US,en;q=0.9",
                //       "anet-appinfo": "web:web:0:480",
                //       "pageguid": "117e3cb3-7d47-446b-b368-3a79185ef6a2",
                //       "priority": "u=1, i",
                //       "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
                //       "sec-ch-ua-mobile": "?0",
                //       "sec-ch-ua-platform": "\"Windows\"",
                //       "sec-fetch-dest": "empty",
                //       "sec-fetch-mode": "cors",
                //       "sec-fetch-site": "same-origin",
                //       "cookie": "__qca=P0-190472410-1729746738556; __gads=ID=8ea9e2ce86981fd1:T=1729746745:RT=1729746745:S=ALNI_MZi9yPX0B0TRoodSeFHpeYdixATvA; __gpi=UID=00000f4a78913e80:T=1729746745:RT=1729746745:S=ALNI_MZX7V5lltzrOngbxdeAYoq2Oxa4Fw; __eoi=ID=2b7c21b927552427:T=1729746745:RT=1729746745:S=AA-AfjYd12FwJnvxMnKeoyzk49Of; __stripe_mid=247fae71-f85c-4b74-8774-30551a62e2dfc94c38; _au_1d=AU1D-0100-001729746793-MSPEG744-63L5; _ncid=8564a09934bcda4322f3b42fa3127c19; _cc_id=874aaf518dfc3810afba434377b7d778; FCNEC=%5B%5B%22AKsRol-b70tcyHKjpLvprxHQnDL_-xuCTs4CgoYQWGMT2Ak_eN8zjB6YsYcv12RN8vO_X-lvew1Qr6N2AwYbmiLqzMWMp5u0lljnmdv1F-dniCTxus4OLenaH3cRaFwWhG58pmTjd36JxEk_Nk11x1QjcMpEXTM0CA%3D%3D%22%5D%5D; _ga=GA1.1.1514716359.1729746739; _ga_CV6QCFM8SJ=GS1.1.1729746738.1.1.1729746892.0.0.0; _ga_PRMJE4PBW4=GS1.1.1729746793.1.1.1729746892.0.0.0; _ga_FVWZ0RM4DH=GS1.1.1729746807.1.1.1729746892.60.0.0; CSUser=username=1989871&emailAddress=alexjunyoung@gmail.com&CommonName=Alex Kim&EnableDisplayName=true; ANETSettings=guid=467cf745-fc47-4349-a125-8d33937658f5&Team=1067&Sport=TF&User=1989871; __stripe_sid=c0af207b-08f2-40b9-80fd-365707b71921bd15c8",
                //       "Referer": "https://www.athletic.net/team/1067/track-and-field-outdoor/2024/athlete-records",
                //       "Referrer-Policy": "strict-origin-when-cross-origin"
                //     },
                //     "body": null,
                //     "method": "GET"
                //   });
                if (!seasonId) {
                    // get year
                    let date = new Date();
                    seasonId = date.getFullYear();
                }
                if (!teamId) {
                    return console.error("No teamId provided");
                }
                const teamCore = await this.GetTeamCore(teamId);
                // console.log("jwt", teamCore);
                try {
                    return fetch(`https://www.athletic.net/api/v1/TeamHome/GetTeamAthleteRecords?teamId=${teamId}&seasonId=${seasonId}`, {
                        "headers": {
                            "anettokens": await teamCore.jwtTeamHome,
                        },
                        "body": null,
                        "method": "GET"
                    }).then(res => res.json());
                }
                catch (e) {
                    console.log(e);
                }
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
            const response = await fetch(`https://www.athletic.net/api/v1/AthleteBio/GetAthleteBioData?athleteId=${athleteId}&sport=${sport}&level=${level}`).then(res => res.json());
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
            const response = await fetch(`https://www.athletic.net/api/v1/Meet/GetMeetData?meetId=${meetId}&sport=tf`, {
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
         * @description Get all the results from a meet
         * @param {String} meetId 
         * @returns {Object}
         */
        GetAllResultsData: async function (meetId) {
            const jwtMeet = await this.GetMeetData(meetId).then(res => res.jwtMeet);

            const response = fetch("https://www.athletic.net/api/v1/Meet/GetAllResultsData?rawResults=false&showTips=false", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "anettokens": await jwtMeet,
                },
                "body": null,
                "method": "GET"
            }).then(res => res.json());

            return response;
        }
    }
};

export default track;