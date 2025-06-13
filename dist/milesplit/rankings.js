"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// URL format
// https://STATEABBREVIATION.milesplit.com/rankings/leaders/LEVEL/SEASON

const levels = {
  "MS Boys": "middle-school-boys",
  "MS Girls": "middle-school-girls",
  "HS Boys": "high-school-boys",
  "HS Girls": "high-school-girls",
  "Club Boys": "club-boys",
  "Club Girls": "club-girls",
  "College Men": "college-men",
  "College Women": "college-women",
  "Alumni Men": "alumni-men",
  "Alumni Women": "alumni-women"
};
const seasons = {
  XC: "cross-country",
  Indoor: "indoor-track-and-field",
  "Ïndoor + Polar Bear": "winter-track-and-field",
  Outdoor: "outdoor-track-and-field"
};
const indoorEvents = {
  Leaders: "leaders",
  "200m": "200m",
  "300m": "300m",
  "400m": "400m",
  "600m": "600m",
  "60m": "60m",
  "150m": "150m",
  "60mH": "60H",
  "3000m": "3000m",
  "1500m": "1500m",
  "1600m": "1600m",
  "1 Mile": "Mile",
  "3200m": "3200m",
  "2 Mile": "2Mile",
  "Shot Put": "S",
  Weight: "WT",
  "High Jump": "HJ",
  "Long Jump": "LJ",
  "Triple Jump": "TJ",
  "Pole Vault": "PV",
  "4x800m": "4x800m",
  DMR: "DMR",
  "SMR 800m": "SMR8"
};
const outdoorEvents = {
  Leaders: "leaders",
  "100m": "100m",
  "200m": "200m",
  "400m": "400m",
  "110mH": "110H",
  "300mH": "300H",
  "800m": "800m",
  "1600m": "1600m",
  "3200m": "3200m",
  Discus: "D",
  "Shot Put": "S",
  "High Jump": "HJ",
  "Long Jump": "LJ",
  "Triple Jump": "TJ",
  "Pole Vault": "PV",
  "4x100m": "4x100m",
  "4x400m": "4x400m",
  "4x800m": "4x800m"
};
const polarBearEvents = {
  Leaders: "leaders",
  "200m": "200m",
  "300m": "300m",
  "400m": "400m",
  "600m": "600m",
  "60m": "60m",
  "150m": "150m",
  "60mH": "60H",
  "3000m": "3000m",
  "1500m": "1500m",
  "1600m": "1600m",
  "1 Mile": "Mile",
  "3200m": "3200m",
  "2 Mile": "2Mile",
  "Shot Put": "S",
  Weight: "WT",
  "High Jump": "HJ",
  "Long Jump": "LJ",
  "Triple Jump": "TJ",
  "Pole Vault": "PV",
  "4x800m": "4x800m",
  DMR: "DMR",
  "SMR 800m": "SMR8"
};
const states = {
  All: "usa",
  AL: "AL",
  AK: "AK",
  AZ: "AZ",
  AR: "AR",
  CA: "CA",
  CO: "CO",
  CT: "CT",
  DE: "DE",
  DC: "DC",
  FL: "FL",
  GA: "GA",
  HI: "HI",
  ID: "ID",
  IL: "IL",
  IN: "IN",
  IA: "IA",
  KS: "KS",
  KY: "KY",
  LA: "LA",
  ME: "ME",
  MD: "MD",
  MA: "MA",
  MI: "MI",
  MN: "MN",
  MS: "MS",
  MO: "MO",
  MT: "MT",
  NE: "NE",
  NV: "NV",
  NH: "NH",
  NJ: "NJ",
  NM: "NM",
  NY: "NY",
  NC: "NC",
  ND: "ND",
  OH: "OH",
  OK: "OK",
  OR: "OR",
  OS: "OS",
  PA: "PA",
  PR: "PR",
  RI: "RI",
  SC: "SC",
  SD: "SD",
  TN: "TN",
  TX: "TX",
  UT: "UT",
  VT: "VT",
  VA: "VA",
  WA: "WA",
  WV: "WV",
  WI: "WI",
  WY: "WY"
};
const grades = {
  All: "",
  SR: "senior",
  JR: "junior",
  SO: "sophomore",
  FR: "freshman",
  "8th": "8th-grade",
  "7th": "7th-grade",
  "6th": "6th-grade",
  Returners: "returners"
};
const years = {
  All: "all",
  2000: "2000",
  2001: "2001",
  2002: "2002",
  2003: "2003",
  2004: "2004",
  2005: "2005",
  2006: "2006",
  2007: "2007",
  2008: "2008",
  2009: "2009",
  2010: "2010",
  2011: "2011",
  2012: "2012",
  2013: "2013",
  2014: "2014",
  2015: "2015",
  2016: "2016",
  2017: "2017",
  2018: "2018",
  2019: "2019",
  2020: "2020",
  2021: "2021",
  2022: "2022",
  2023: "2023",
  2024: "2024",
  2025: "2025",
  2026: "2026"
};

// https://www.milesplit.com/rankings/leaders/high-school-boys/cross-country?year=2024&grade=senior

// https://www.milesplit.com/rankings/pro/high-school-boys/cross-country/5000m?year=2024&grade=senior?year=2024

/**
 * @param {import('./types').Season} season
 * @param {import('./types').Level} level
 * @param {import('./types').State} state
 * @param {import('./types').Event} [event="Leaders"]
 * @param {import('./types').Grade} [grade]
 * @param {import('./types').Year} [year]
 * @returns {Promise<string | null>}
 */
async function getRankings(season, level, state, event = "Leaders", grade, year) {
  console.log("Parameters:", {
    season,
    level,
    state,
    event,
    grade,
    year
  });
  const baseUrl = `https://${states[state]}.milesplit.com/rankings`;
  let url;
  let params = new URLSearchParams();
  if (year && years[year] !== 'all') params.append('year', years[year]);
  if (grade && grades[grade]) params.append('grade', grades[grade]);
  if (!event || event === 'Leaders' || event === null) {
    url = `${baseUrl}/leaders/${levels[level]}/${seasons[season]}${params.toString() ? '?' + params.toString() : ''}`;
  }
  // } else {
  //     url = `${baseUrl}/pro/${levels[level]}/${seasons[season]}/${event}${params.toString() ? '?' + params.toString() : ''}`;
  // }

  console.log("Fetching URL:", url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Failed to fetch rankings:", error);
    return null;
  }
}
var _default = exports.default = getRankings;