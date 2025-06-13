

# UnOfficial Athletic.Net API Wrapper for NodeJS

## About
I'm currently a high schooler participating in Cross Country and Track and Field. Athletic.Net (along with other websites) are crucial in saving performance information. In order to parse this information, plot our progression, and analyze competitors, I've made this NPM module to help obtain related information.

## Todo

- [] Website
- [] Discord Bot
- [] Example Functions
- [] Better API Documentation

### Cross Country API
- [x] Team
- [x] Athlete
- [x] Meet
- [] Ranking

### Track and Field API

- [x] Team
- [x] Athlete
- [x] Meet
- [] Ranking

## API Documentation

### Athletic.net API

#### Track & Field API

##### Team Functions
- `GetAthletes(teamId: string, sport?: string, year?: string)` - Gets all athletes on a team
- `GetTeamCore(teamId: string, sport: string, year: string)` - Gets basic team information and JWT token
- `GetCalendar(teamId: string, sport: string, year: string)` - Gets the team's meet calendar
- `Team(teamId: string, year: string)` - Gets basic team information
- `GetTeamEventRecords(teamId: string, year: string)` - Gets team records for all events

###### Team Records
- `GetTeamEventRecords(teamId: string, year: string)` - Gets event records for specific year
- `Seasons_TeamReports(teamId: string)` - Gets valid seasons for team reports
- `GetTeamRecords(teamId: string, gender?: string, eventShort?: string, indoor?: boolean, qParams?: object)` - Gets team/school records

##### Athlete Functions
- `GetAthleteBioData(athleteId: string, sport: string, level?: number)` - Gets athlete biographical data and results

##### Meet Functions
- `GetMeetData(meetId: string)` - Gets basic meet information
- `GetAllResultsData(meetId: string)` - Gets all results from a meet
- `GetTeams(meetId: string)` - Gets teams participating in a meet

#### Cross Country API

##### Team Functions
- `Team(teamId: string, year: string)` - Gets basic team information
- `GetTeamCore(teamId: string, year?: string)` - Gets team information and JWT token
- `GetCalendar(teamId: string, year?: string)` - Gets team meet calendar
- `GetAthletes(teamId: string, year?: string)` - Gets team roster

###### Team Records
- `seasonBests(teamId: string, year?: string)` - Gets season best performances
- `TeamRecords(teamId: string)` - Gets all-time team records

##### Athlete Functions
- `GetAthleteBioData(athleteId: string, level?: number)` - Gets athlete bio and results
- `GetRankings(athleteId: string, seasonId: string)` - Gets athlete rankings

##### Meet Functions
- `GetMeetData(meetId: string)` - Gets basic meet information
- `GetAllResultsData(meetId: string)` - Gets all race results
- `GetResultsData(meetId: string, raceId: string)` - Gets specific race results
- `GetIndividualRaceResults(meetId: string, raceId: string)` - Gets individual results
- `GetXCMoreData(meetId: string)` - Gets additional meet data

##### Additional Functions
- `GetUncategorizedTeams()` - Gets uncategorized teams
- `GetTree()` - Gets division hierarchy
- `GetDivisions()` - Gets available divisions

### MileSplit API

##### Rankings Functions
- `getRankings(season: Season, level: Level, state: State, event?: Event, grade?: Grade, year?: Year)` - Gets rankings for specific criteria

##### Search Functions
- `getSearchToken()` - Gets search authentication token
- `fetchTeams(query: string)` - Searches for teams
- `fetchAthletes(query: string)` - Searches for athletes

##### Meet Functions
- `getMeets(season: string, level: string, state: string, month: string, year: string)` - Gets meet listings
- `getPerformances(meetId: string, resultsId: string)` - Gets meet results

##### Home Functions
- `getLiveEvents()` - Gets currently live events

## Updating the package

###### remember to switch type from commonjs to module
```bash
npm version patch / minor / major
npm publish
 ```

**Copilot was used in making this project**