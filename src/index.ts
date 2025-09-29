import cron from 'node-cron';
import { fetchWaterFlowData } from './fetcher';
import { saveWaterFlowData } from './database';
import { startServer } from './server';
import fs from 'fs';
import path from 'path';

// Ensure the public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Function to poll the website and update the database
async function pollWebsiteAndUpdateDB() {
  try {
    console.log('Polling Vattenfall Boden power plant website...');
    const data = await fetchWaterFlowData();
    console.log(`Got data: ${data.lastUpdate}`);

    // Save data to the database if it doesn't already exist
    const saved = saveWaterFlowData(data);

    if (saved) {
      console.log(`New data saved: ${data.lastUpdate}`);
    } else {
      console.log(`Data already exists for: ${data.lastUpdate}`);
    }
  } catch (error) {
    console.error('Error polling website:', error);
  }
}

// Start the server
startServer();

// Poll the website immediately on startup
pollWebsiteAndUpdateDB();

// Schedule polling every hour
cron.schedule('0 * * * *', () => {
  pollWebsiteAndUpdateDB();
});

console.log('Boden Water Flow Tracker started ✨');
