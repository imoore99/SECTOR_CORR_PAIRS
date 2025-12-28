// main.js - The Orchestrator
import { getDashboardData } from './data.js';
import { allPairs } from './allPairs.js';
//import { initSelectPage } from './select.js';
import { initDashboard } from './index.js';

async function startApp() {
    try {
        // 1. Wait for S3 to return the real arrays
        const data = await getDashboardData(); 

        // Trigger your wrapped functions with the FRESH DATA
        // These now receive Arrays, not Promises.
        //initSelectPage(data.currentSignalsData, data.allSpreadsData, data.signalsHistoryData, allPairs);
        initDashboard(data.currentSignalsData, data.allSpreadsData, data.signalsHistoryData, allPairs);
        
    } catch (error) {
        console.error("The waterfall failed to start:", error);
    }
}

// Start the sequence
startApp();
