const crosscountry = require('../../dist/modules/crosscountry').default;
const fs = require("fs");

const ATHLETEID = "18861011";
const TEAMID = "1636";
const MEETID = "237737";
const RACEID = "1004148";

(async () => {
    // Team

    const team = crosscountry.team;

    // Team

    fs.writeFileSync("tests/outputs/crosscountry/getTeam.json", JSON.stringify(await team.Team(TEAMID)));

    // GetTeamCore

    fs.writeFileSync(
        "tests/outputs/crosscountry/getTeamCore.json",
        JSON.stringify(await team.GetTeamCore(TEAMID))
    );

    // GetCalendar

    fs.writeFileSync(
        "tests/outputs/crosscountry/getCalendar.json",
        JSON.stringify(await team.GetCalendar(TEAMID))
    );

    // GetAthletes

    fs.writeFileSync(
        "tests/outputs/crosscountry/getAthletes.json",
        JSON.stringify(await team.GetAthletes(TEAMID))
    );

    // Records

    const records = crosscountry.team.records;

    //seasonBests

    fs.writeFileSync(
        "tests/outputs/crosscountry/seasonBests.json",
        JSON.stringify(await records.seasonBests(TEAMID))
    );

    //TeamRecords

    fs.writeFileSync(
        "tests/outputs/crosscountry/TeamRecords.json",
        JSON.stringify(await records.TeamRecords(TEAMID))
    );

    // Athlete

    const athlete = crosscountry.athlete;

    // GetAthleteBioData

    fs.writeFileSync(
        "tests/outputs/crosscountry/getAthleteBioData.json",
        JSON.stringify(await athlete.GetAthleteBioData(ATHLETEID))
    );

    // GetRankings

    fs.writeFileSync(
        "tests/outputs/crosscountry/getRankings.json",
        JSON.stringify(await athlete.GetRankings(ATHLETEID))
    );

    // Meet

    const meet = crosscountry.meet;

    // GetMeetData

    fs.writeFileSync(
        "tests/outputs/crosscountry/getMeetData.json",
        JSON.stringify(await meet.GetMeetData(MEETID))
    );

    // GetAllResultsData

    fs.writeFileSync(
        "tests/outputs/crosscountry/getAllResultsData.json",
        JSON.stringify(await meet.GetAllResultsData(MEETID))
    );

    // GetResultsData2

    fs.writeFileSync(
        "tests/outputs/crosscountry/getResultsData2.json",
        JSON.stringify(await meet.GetResultsData(MEETID, RACEID))
    );

    // GetIndividualRaceResults

    fs.writeFileSync(
        "tests/outputs/crosscountry/getIndividualRaceResults.json",
        JSON.stringify(await meet.GetIndividualRaceResults(MEETID, RACEID))
    );

    // GetXCMoreData

    fs.writeFileSync(
        "tests/outputs/crosscountry/getXCMoreData.json",
        JSON.stringify(await meet.GetXCMoreData(MEETID))
    );

    // GetUncategorizedTeams

    fs.writeFileSync(
        "tests/outputs/crosscountry/getUncategorizedTeams.json",
        JSON.stringify(await crosscountry.GetUncategorizedTeams(MEETID))
    );

    // GetTree

    fs.writeFileSync(
        "tests/outputs/crosscountry/getTree.json",
        JSON.stringify(await crosscountry.GetTree(MEETID))
    );

    // GetDivisions

    fs.writeFileSync(
        "tests/outputs/crosscountry/getDivisions.json",
        JSON.stringify(await crosscountry.GetDivisions(MEETID))
    );


})();