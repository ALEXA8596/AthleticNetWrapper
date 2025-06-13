// Seasons type from seasons object keys
export type Season = 'XC' | 'Indoor' | 'Ïndoor + Polar Bear' | 'Outdoor';

// Levels type from levels object keys
export type Level = 'MS Boys' | 'MS Girls' | 'HS Boys' | 'HS Girls' | 
                   'Club Boys' | 'Club Girls' | 'College Men' | 'College Women' |
                   'Alumni Men' | 'Alumni Women';

// States type from states object keys
export type State = 'All' | 'AL' | 'AK' | 'AZ' | /* ...etc */ 'WY';

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
  "SMR 800m": "SMR8",
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
  "4x800m": "4x800m",
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
  "SMR 800m": "SMR8",
};

// Events type combining all event types
export type Event = keyof typeof indoorEvents | 
                   keyof typeof outdoorEvents | 
                   keyof typeof polarBearEvents;

// Grades type from grades object keys
export type Grade = 'All' | 'SR' | 'JR' | 'SO' | 'FR' | '8th' | '7th' | '6th' | 'Returners';

// Years type from years object keys
export type Year = '2000' | '2001' |	
 '2002' | '2003' | '2004' | '2005' | '2006' | '2007' | '2008' | '2009' | '2010' | 
 '2011' | '2012' | '2013' | '2014' | '2015' | '2016' | '2017' | '2018' | '2019' | '2020' | 
 '2021' | '2022' | '2023' | '2024' | '2025';

// Function type definition
export type GetRankingsFunction = {
    (
        season: Season,
        level: Level,
        state: State,
        event?: Event,
        grade?: Grade,
        year?: Year
    ): Promise<string | null>;
}