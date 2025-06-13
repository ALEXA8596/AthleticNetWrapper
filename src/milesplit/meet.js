const month = {
  "": "",
  January: "1",
  February: "2",
  March: "3",
  April: "4",
  May: "5",
  June: "6",
  July: "7",
  August: "8",
  September: "9",
  October: "10",
  November: "11",
  December: "12",
};

const year = {
  "": "",
  2025: "2025",
  2024: "2024",
  2023: "2023",
  2022: "2022",
  2021: "2021",
  2020: "2020",
  2019: "2019",
  2018: "2018",
  2017: "2017",
  2016: "2016",
  2015: "2015",
  2014: "2014",
  2013: "2013",
  2012: "2012",
  2011: "2011",
  2010: "2010",
  2009: "2009",
  2008: "2008",
  2007: "2007",
  2006: "2006",
};

const level = {
  All: "",
  Youth: "youth",
  "Middle School": "ms",
  "High School": "hs",
  College: "college",
  Open: "open",
  "Pro/Elite": "pro",
};

async function getMeets(season, level, state, month, year) {
  // https://www.milesplit.com/results/?season=cc&level=all&page=2?&month=9&year=2024
  const params = new URLSearchParams();
  if (season) params.append("season", season);
  if (level && level !== "All") params.append("level", level);
  if (state) params.append("state", state);
  if (month && month !== "") params.append("month", month);
  if (year && year !== "") params.append("year", year);
  const queryString = params.toString();
  const url = `https://www.milesplit.com/results/?${queryString}`;
  console.log("Fetching meets from URL:", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching meets: ${response.statusText}`);
  }
  return await response.text();
}

// https://ca.milesplit.com/meets/665700-arcadia-invitational-2025/coverage
// https://ca.milesplit.com/api/v1/meets/665700/performances?isMeetPro=0&resultsId=1144979&fields=id%2CmeetId%2CmeetName%2CteamId%2CvideoId%2CteamName%2CathleteId%2CfirstName%2ClastName%2Cgender%2CgenderName%2CdivisionId%2CdivisionName%2CmeetResultsDivisionId%2CresultsDivisionId%2CageGroupName%2CgradYear%2CeventName%2CeventCode%2CeventDistance%2CeventGenreOrder%2Cround%2CroundName%2Cheat%2Cunits%2Cmark%2Cplace%2CwindReading%2CprofileUrl%2CteamProfileUrl%2CperformanceVideoId%2CteamLogo%2CstatusCode&m=GET

fetch(
  "https://ca.milesplit.com/api/v1/meets/665700/performances?isMeetPro=1&resultsId=1144979&fields=id%2CmeetId%2CmeetName%2CteamId%2CvideoId%2CteamName%2CathleteId%2CfirstName%2ClastName%2Cgender%2CgenderName%2CdivisionId%2CdivisionName%2CmeetResultsDivisionId%2CresultsDivisionId%2CageGroupName%2CgradYear%2CeventName%2CeventCode%2CeventDistance%2CeventGenreOrder%2Cround%2CroundName%2Cheat%2Cunits%2Cmark%2Cplace%2CwindReading%2CprofileUrl%2CteamProfileUrl%2CperformanceVideoId%2CteamLogo%2CstatusCode&m=GET",
  {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      appname: "MileSplit",
      apptoken: "f8a6f964ea4fb2e2758ad564ccbf22f5",
      priority: "u=1, i",
      cookie: "unique_id=764dfaf07333088a50776646417cb4eb; ",
    },
    body: null,
    method: "GET",
  }
);

async function getPerformances(meetId, resultsId) {
  const fields = [
    "id",
    "meetId",
    "meetName",
    "teamId",
    "videoId",
    "teamName",
    "athleteId",
    "firstName",
    "lastName",
    "gender",
    "genderName",
    "divisionId",
    "divisionName",
    "meetResultsDivisionId",
    "resultsDivisionId",
    "ageGroupName",
    "gradYear",
    "eventName",
    "eventCode",
    "eventDistance",
    "eventGenreOrder",
    "round",
    "roundName",
    "heat",
    "units",
    "mark",
    "place",
    "windReading",
    "profileUrl",
    "teamProfileUrl",
    "performanceVideoId",
    "teamLogo",
    "statusCode",
  ];

  const url = `https://ca.milesplit.com/api/v1/meets/${meetId}/performances?isMeetPro=0&resultsId=${resultsId}&fields=${encodeURI(fields.join(","))}&m=GET`;
  console.log("Fetching performances from URL:", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching performances: ${response.statusText}`);
  }
  return await response.json();
}

export { getMeets, getPerformances };