import track from './athletic/track.js';
import crosscountry from './athletic/crosscountry.js';
import search from './athletic/search.js';

import {getLiveEvents} from './milesplit/home.js';
import {getSearchToken, fetchTeams, fetchAthletes} from './milesplit/search.js';
import {default as getRankings} from './milesplit/rankings.js';
import {getMeets, getPerformances} from './milesplit/meet.js';


const athletic = {
    track,
    crosscountry,
    search
};

const milesplit = {
    meets: {
        getMeets,
        getPerformances
    },
    rankings: getRankings,
    search: {
        getSearchToken,
        fetchTeams,
        fetchAthletes
    },
    home: {
        getLiveEvents
    },
}

export { athletic, milesplit };

export default { athletic, milesplit };