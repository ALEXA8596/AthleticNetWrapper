const track = require("../../dist/modules/track").default;
const fs = require("fs");

const ATHLETEID = "18861011";
const TEAMID = "1636";
const MEETID = "517131";

(async () => {
  // Team

  const team = track.team;

  // GetAthletes

  fs.writeFileSync(
    "tests/outputs/track/getAthletes.json",
    JSON.stringify(await team.GetAthletes(TEAMID))
  );

  // GetTeamCore

  fs.writeFileSync(
    "tests/outputs/track/getTeamCore.json",
    JSON.stringify(await team.GetTeamCore(TEAMID))
  );

  // GetCalendar

  fs.writeFileSync(
    "tests/outputs/track/getCalendar.json",
    JSON.stringify(await team.GetCalendar(TEAMID))
  );

  // Team

  fs.writeFileSync("tests/outputs/track/getTeam.json", JSON.stringify(await team.Team(TEAMID)));

  //GetTeamEventRecords

  fs.writeFileSync(
    "tests/outputs/track/getTeamEventRecords.json",
    JSON.stringify(await team.GetTeamEventRecords(TEAMID))
  );

  // Records

  const records = track.team.records;

  //GetTeamEventRecords

  fs.writeFileSync(
    "tests/outputs/track/getTeamEventRecords.json",
    JSON.stringify(await records.GetTeamEventRecords(TEAMID))
  );

    //Seasons_TeamReports

    fs.writeFileSync(
        "tests/outputs/track/seasons_TeamReports.json",
        JSON.stringify(await records.Seasons_TeamReports(TEAMID))
    );

    //GetTeamRecords

    fs.writeFileSync(
        "tests/outputs/track/getTeamRecords.json",
        JSON.stringify(await records.GetTeamRecords(TEAMID))
    );

    //  Athlete

    const athlete = track.athlete;

    //GetAthleteBioData

    fs.writeFileSync(
        "tests/outputs/track/getAthleteBioData.json",
        JSON.stringify(await athlete.GetAthleteBioData(ATHLETEID, "tf"))
    );

    // Meet

    const meet = track.meet;

    //GetMeetData

    fs.writeFileSync(
        "tests/outputs/track/getMeetData.json",
        JSON.stringify(await meet.GetMeetData(MEETID))
    );

    //GetAllResultsData

    fs.writeFileSync(
        "tests/outputs/track/getAllResultsData.json",
        JSON.stringify(await meet.GetAllResultsData(MEETID))
    );
})();
