import fetch from 'node-fetch';

async function getLiveEvents() {
  const response = await fetch("https://www.milesplit.com/api/v1/liveevents");
  return await response.json();
}

export default getLiveEvents
