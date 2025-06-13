const fetch = require('node-fetch');

export default {
    getLiveEvents: async function () {
        const response = await fetch("https://www.milesplit.com/api/v1/liveevents");
        return await response.json();
    },
}