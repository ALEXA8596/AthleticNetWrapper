// const getRankings = require('./rankings');
import getRankings from "./rankings.js";
import { getSearchToken, fetchTeams, fetchAthletes } from "./search.js";

// // getRankings('XC', 'HS Boys', 'All', null, 'senior', 2024).then(res => console.log(res)).catch(err => console.error(err));
// getSearchToken().then(token => {
//     console.log("Search Token:", token);
// })
// 
// fetchAthletes("Jane Hedengren").then(data => {
//     console.log("Teams Data:", data);
// })
