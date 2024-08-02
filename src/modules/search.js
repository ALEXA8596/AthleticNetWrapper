import fetch from "node-fetch";
import { DOMParser } from '@xmldom/xmldom';

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
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "priority": "u=1, i",
                "referrer-policy": "strict-origin-when-cross-origin",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "Referer": "https://www.athletic.net/Search.aspx",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": JSON.stringify({
                q: query,
                start: 0,
                fq: fq || "",
            }),
            "method": "POST"
        }).then(async res => await res.json());
        var document = new DOMParser().parseFromString("<table>" + response.d.results + "</table>", 'text/html');

        [...document.getElementsByTagName('i')].forEach((element) => element.remove());
        [...document.getElementsByTagName('i')].forEach((element) => element.remove());
        // [...document.getElementsByClassName('sportIcon')].forEach((element) => element.remove());
        [...document.getElementsByTagName("a")].forEach((element) => {
            if (element.children.length === 0 && element.textContent === "") {
                element.remove();
            }
        });

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
                    id: url.split("/")[1],
                    school: row.getElementsByTagName("a")[1].textContent,
                };
                info.push(athlete);
            } else if (url.includes("/team/")) {
                const team = {
                    name: row.getElementsByClassName("result-title-tf")[0].textContent,
                    url: "https://athletic.net/" + firstUrl.href,
                    id: row.getElementsByClassName("result-title-tf")[0].href.split("/")[1],
                };
                info.push(team);
            }
            else if (url.includes("/meet/")) {
                // console.log(row.outerHTML);
                const meet = {
                    name: row.getElementsByTagName("a")[0].textContent.trim(),
                    url: "https://athletic.net/" + firstUrl.href,
                    id: row.getElementsByTagName("a")[0].href.split("/")[2],
                };
                info.push(meet);
            }
        }
        return {
            responses: info,
            raw: response
        };
    },
};

export default search;