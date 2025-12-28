




// Sample data matching your API response format
let sampleCurrentSignals = [
  {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "C_GS",
        "stock1": "C",
        "stock2": "GS",
        "z_score": -0.0053845181,
        "signal": "NO SIGNAL",
        "signal_status": "IN_RANGE",
        "correlation": 0.8477710619,
        "coint_pvalue": 0.0012815713,
        "confidence": "high"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "AXP_BAC",
        "stock1": "AXP",
        "stock2": "BAC",
        "z_score": 1.8643538221,
        "signal": "NO SIGNAL",
        "signal_status": "IN_RANGE",
        "correlation": 0.771022278,
        "coint_pvalue": 0.0186517528,
        "confidence": "high"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "GS_WFC",
        "stock1": "GS",
        "stock2": "WFC",
        "z_score": 1.9658384187,
        "signal": "NO SIGNAL",
        "signal_status": "IN_RANGE",
        "correlation": 0.7678526837,
        "coint_pvalue": 0.0220745209,
        "confidence": "high"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "COP_EOG",
        "stock1": "COP",
        "stock2": "EOG",
        "z_score": 2.6994129813,
        "signal": "SELL COP / BUY EOG",
        "signal_status": "DIVERGED",
        "correlation": 0.8739292084,
        "coint_pvalue": 0.0803814057,
        "confidence": "moderate"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "MS_WFC",
        "stock1": "MS",
        "stock2": "WFC",
        "z_score": 2.0961953471,
        "signal": "SELL MS / BUY WFC",
        "signal_status": "DIVERGED",
        "correlation": 0.8039163393,
        "coint_pvalue": 0.0265584569,
        "confidence": "high"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "JPM_WFC",
        "stock1": "JPM",
        "stock2": "WFC",
        "z_score": -0.9148738233,
        "signal": "NO SIGNAL",
        "signal_status": "IN_RANGE",
        "correlation": 0.7453407485,
        "coint_pvalue": 0.1441130196,
        "confidence": "low"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "C_JPM",
        "stock1": "C",
        "stock2": "JPM",
        "z_score": 2.832204725,
        "signal": "SELL C / BUY JPM",
        "signal_status": "DIVERGED",
        "correlation": 0.7986342446,
        "coint_pvalue": 0.2665121727,
        "confidence": "low"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "BAC_MS",
        "stock1": "BAC",
        "stock2": "MS",
        "z_score": -3.0397822601,
        "signal": "BUY BAC / SELL MS",
        "signal_status": "DIVERGED",
        "correlation": 0.8229708977,
        "coint_pvalue": 0.0908762005,
        "confidence": "moderate"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "AXP_MS",
        "stock1": "AXP",
        "stock2": "MS",
        "z_score": -2.0290407716,
        "signal": "BUY AXP / SELL MS",
        "signal_status": "DIVERGED",
        "correlation": 0.7898015161,
        "coint_pvalue": 0.0311495387,
        "confidence": "high"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "GS_JPM",
        "stock1": "GS",
        "stock2": "JPM",
        "z_score": 3.4639027597,
        "signal": "SELL GS / BUY JPM",
        "signal_status": "DIVERGED",
        "correlation": 0.8347969594,
        "coint_pvalue": 0.5405675279,
        "confidence": "low"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "C_WFC",
        "stock1": "C",
        "stock2": "WFC",
        "z_score": 1.7109524496,
        "signal": "NO SIGNAL",
        "signal_status": "IN_RANGE",
        "correlation": 0.8176731268,
        "coint_pvalue": 0.0877804517,
        "confidence": "moderate"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "GS_MS",
        "stock1": "GS",
        "stock2": "MS",
        "z_score": 1.1797444985,
        "signal": "NO SIGNAL",
        "signal_status": "IN_RANGE",
        "correlation": 0.9178893109,
        "coint_pvalue": 0.2330529789,
        "confidence": "low"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "COP_CVX",
        "stock1": "COP",
        "stock2": "CVX",
        "z_score": 0.4570134095,
        "signal": "NO SIGNAL",
        "signal_status": "IN_RANGE",
        "correlation": 0.8284900691,
        "coint_pvalue": 0.1669158914,
        "confidence": "low"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "HD_LOW",
        "stock1": "HD",
        "stock2": "LOW",
        "z_score": -3.2999030463,
        "signal": "BUY HD / SELL LOW",
        "signal_status": "DIVERGED",
        "correlation": 0.8884994347,
        "coint_pvalue": 0.9800607911,
        "confidence": "low"
    },
    {
        "date": "2025-12-10T00:00:00.000",
        "pair_id": "C_MS",
        "stock1": "C",
        "stock2": "MS",
        "z_score": 0.8365366452,
        "signal": "NO SIGNAL",
        "signal_status": "IN_RANGE",
        "correlation": 0.8558171705,
        "coint_pvalue": 0.30361045,
        "confidence": "low"
    }
];