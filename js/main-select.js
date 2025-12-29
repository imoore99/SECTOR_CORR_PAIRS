// main.js - The Orchestrator
import { getDashboardData } from './data.js';
import { allPairs } from './allPairs.js';
import { initSelectPage } from './select.js';

async function startApp() {
    try {
        // Wait for S3 to return the real arrays
        const data = await getDashboardData(); 

        initSelectPage(data.currentSignalsData, data.allSpreadsData, data.signalsHistoryData, allPairs);
       
    } catch (error) {
        console.error("The waterfall failed to start - main-select:", error);
    }
}

// Start the sequence
startApp();
