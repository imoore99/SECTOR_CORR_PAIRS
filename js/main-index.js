// main.js - The Orchestrator
import { getDashboardData } from './data.js';
import { allPairs } from './allPairs.js';
import { initDashboard } from './index.js';

async function startApp() {
    try {
        // Wait for S3 to return the real arrays
        const data = await getDashboardData(); 

        initDashboard(data.currentSignalsData, data.allSpreadsData, data.signalsHistoryData, allPairs);
        
    } catch (error) {
        console.error("The waterfall failed to main-index:", error);
    }
}

// Start the sequence
startApp();
