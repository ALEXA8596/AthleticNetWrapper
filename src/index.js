import track from './athletic/track.js';
import crosscountry from './athletic/crosscountry.js';
import search from './athletic/search.js';

import {getLiveEvents} from './home.js';
import {getSearchToken, fetchTeams, fetchAthletes} from './search.js';
import {default as getRankings} from './rankings.js';
import {getMeets, getPerformances} from './meet.js';


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