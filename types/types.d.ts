declare module 'athletichelper' {
    // --- AthleticNet Types ---
    export interface TrackTeamAPI {
        GetAthletes(teamId: string, sport?: string, year?: string): Promise<string>;
        GetTeamCore(teamId: string, sport: string, year: string): Promise<any>;
        GetCalendar(teamId: string, sport: string, year: string): Promise<any>;
        Team(teamId: string, year: string): Promise<any>;
        GetTeamEventRecords(teamId: string, year: string): Promise<any>;
        records: {
            GetTeamEventRecords(teamId: string, year: string): Promise<any>;
            Seasons_TeamReports(teamId: string): Promise<any>;
            GetTeamRecords(teamId: string, gender?: string, eventShort?: string, indoor?: boolean | null, qParams?: Record<string, any>): Promise<any>;
        };
    }

    export interface TrackAPI {
        team: TrackTeamAPI;
        athlete: {
            GetAthleteBioData(athleteId: string, sport: string, level?: number): Promise<any>;
        };
        meet: {
            GetMeetData(meetId: string): Promise<any>;
            GetAllResultsData(meetId: string): Promise<any>;
            GetTeams(meetId: string): Promise<any>;
        };
    }

    export interface CrossCountryAPI {
        team: {
            Team(teamId: string, year: string): Promise<any>;
            GetTeamCore(teamId: string, year?: string | null): Promise<any>;
            GetCalendar(teamId: string, year?: string | null): Promise<any>;
            GetAthletes(teamId: string, year?: string | null): Promise<any>;
            records: {
                seasonBests(teamId: string, year?: string): Promise<any>;
                TeamRecords(teamId: string): Promise<any>;
            };
        };
        athlete: {
            GetAthleteBioData(athleteId: string, level?: number): Promise<any>;
            GetRankings(athleteId: string, seasonId: string): Promise<any>;
        };
        meet: {
            GetMeetData(meetId: string): Promise<any>;
            GetAllResultsData(meetId: string): Promise<any>;
            GetResultsData(meetId: string, raceId: string): Promise<any>;
            GetIndividualRaceResults(meetId: string, raceId: string): Promise<any>;
            GetXCMoreData(meetId: string): Promise<any>;
        };
        GetUncategorizedTeams(): Promise<any>;
        GetTree(): Promise<any>;
        GetDivisions(): Promise<any>;
    }

    export interface SearchAPI {
        AutoComplete(query: string): Promise<any>;
        runSearch(query: string): Promise<any>;
    }

    export interface AthleticAPI {
        track: TrackAPI;
        crosscountry: CrossCountryAPI;
        search: SearchAPI;
    }

    // --- MileSplit Types ---
    export interface MileSplitMeetsAPI {
        getMeets(...args: any[]): Promise<any>;
        getPerformances(...args: any[]): Promise<any>;
    }

    export interface MileSplitSearchAPI {
        getSearchToken(query: string): Promise<any>;
        fetchTeams(query: string): Promise<any>;
        fetchAthletes(query: string): Promise<any>;
    }

    export interface MileSplitHomeAPI {
        getLiveEvents(): Promise<any>;
    }

    export type MileSplitRankingsAPI = (...args: any[]) => Promise<any>;

    export interface MileSplitAPI {
        meets: MileSplitMeetsAPI;
        rankings: MileSplitRankingsAPI;
        search: MileSplitSearchAPI;
        home: MileSplitHomeAPI;
    }

    // --- Main Export ---
    export const athletic: AthleticAPI;
    export const milesplit: MileSplitAPI;
    const _default: { athletic: AthleticAPI; milesplit: MileSplitAPI };
    export default _default;
}