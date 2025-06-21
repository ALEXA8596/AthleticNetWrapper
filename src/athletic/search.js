import fetch from "node-fetch";

import getDocument from "../helpers/getDocument";

const search = {
    AutoComplete: async function (query) {
        const response = await fetch(`https://www.athletic.net/api/v1/AutoComplete/search?q=${query}&fq=`).then(res => res.json());
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
        const response = await fetch("https://www.athletic.net/Search.aspx/runSearch", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "content-type": "application/json",
                "mode": "cors"
            },
            "body": JSON.stringify({
                q: query,
                start: 0,
                fq: fq || "",
            }),
            "method": "POST"
        }).then(async res => await res.json());
        var document = await getDocument("<table>" + response.d.results + "</table>");

        [...document.getElementsByTagName('i')].forEach((element) => element.remove());
        [...document.getElementsByClassName('sportIcon')].forEach((element) => element.remove());
        [...document.getElementsByTagName('span')].forEach((element) => element.remove());

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
                    school: row.getElementsByClassName("small")[0].children[1].textContent,
                };
                info.push(athlete);
            } else if (url.includes("/team/")) {
                const team = {
                    name: row.getElementsByClassName("result-title-tf")[0].textContent,
                    url: "https://athletic.net/" + row.getElementsByTagName("a")[1].href,
                    id: row.getElementsByClassName("result-title-tf")[0].href.split("/")[2],
                };
                info.push(team);
            }
            else if (url.includes("/meet/")) {
                // console.log(row.outerHTML);
                const meet = {
                    name: row.getElementsByTagName("a")[1].textContent.trim(),
                    url: "https://athletic.net/" + row.getElementsByTagName("a")[1].href,
                    id: row.getElementsByTagName("a")[1].href.split("/").pop(),
                };
                info.push(meet);
            }
        }
        return {
            responses: info,
            editedDom: document.body.innerHTML,
            raw: response
        };
    },
};

export default search;