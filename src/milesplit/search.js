import fetch from "../helpers/fetch";

async function getSearchToken() {
  const token = await fetch("https://www.milesplit.com/search")
    .then((response) => response.text())
    .then((html) => {
      const match = html.match(/searchToken=([a-f0-9]{32})/);
      if (match) {
        return match[1];
      } else {
        throw new Error("Search token not found");
      }
    });
  console.log("Token:", await token);
  return token;
}

async function fetchTeams(query) {
  // get search token

  const searchToken = await getSearchToken();

  console.log("Search Token:", searchToken);

  try {
    const response = await fetch("https://www.milesplit.com/search/v2/teams", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        Cookie:
          "unique_id=" + searchToken+";",
      },
      body: new URLSearchParams({
        searchToken: await searchToken,
        q: query,
        perPage: "25",
      }).toString(),
      method: "POST",
    });

    if (!response.ok) {
      //   console.log(response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return null;
  }
}

async function fetchAthletes(query) {
    // get search token
    
    const searchToken = await getSearchToken();
    
    console.log("Search Token:", searchToken);
    
    try {
        const response = await fetch("https://www.milesplit.com/search/v2/athletes", {
        headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            Cookie:
            "unique_id=" + searchToken+";",
        },
        body: new URLSearchParams({
            searchToken: await searchToken,
            q: query,
            perPage: "25",
        }).toString(),
        method: "POST",
        });

        if (!response.ok) {
            //   console.log(response);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching athletes:", error);
        return null;
    }
}


// TODO
// DOESN'T HAVE AN API, HAVE TO MANUALLY SCRAPE


// export async function fetchMeets(query) {
//     fetch("https://www.milesplit.com/search", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "max-age=0",
//     "content-type": "application/x-www-form-urlencoded",
//     "priority": "u=0, i",
//     "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-origin",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1",
//     "cookie": "unique_id=" + + ";",
//     "Referer": "https://www.milesplit.com/search",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": "searchToken=&isState=&subdomain=www&nationalDomain=&stateFullName=&category=meet&q=" + + "",
//   "method": "POST"
// });
// }

export { getSearchToken, fetchTeams, fetchAthletes };