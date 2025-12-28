

// data.js
export async function getDashboardData() {
  const URLS = {
    SIGNALS: "https://sector-corr-spreads.s3.us-east-1.amazonaws.com/dashboard/current_signals.json",
    SPREADS: "https://sector-corr-spreads.s3.us-east-1.amazonaws.com/dashboard/all_spreads.json",
    HISTORY: "https://sector-corr-spreads.s3.us-east-1.amazonaws.com/dashboard/signal_history.json"
  };

  async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  const [currentSignalsData, allSpreadsData, signalsHistoryData] = await Promise.all([
    loadJson(URLS.SIGNALS),
    loadJson(URLS.SPREADS),
    loadJson(URLS.HISTORY)
  ]);

  return {currentSignalsData, allSpreadsData, signalsHistoryData};
}


