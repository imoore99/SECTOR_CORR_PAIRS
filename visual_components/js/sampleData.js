

const allPairs = [
    { id: 'AXP_BAC', name: 'AXP / BAC', Coorelation: 0.7715, p_value: 0.0017, confidence: 'High'}, ///X
    { id: 'AXP_MS', name: 'AXP / MS', Coorelation: 0.7906, p_value: 0.0352, confidence: 'High'}, ///X
    { id: 'BAC_MS', name: 'BAC / MS', Coorelation: 0.8204, p_value: 0.0766, confidence: 'Moderate'}, ///X
    { id: 'C_GS', name: 'C / GS', Coorelation: 0.8400, p_value: 0.0089, confidence: 'High'}, ///X
    { id: 'C_JPM', name: 'C / JPM', Coorelation: 0.8156, p_value: 0.0704, confidence: 'Moderate'}, ///X
    { id: 'C_MS', name: 'C / MS', Coorelation: 0.8502, p_value: 0.0571, confidence: 'Moderate'}, ///X
    { id: 'C_WFC', name: 'C / WFC', Coorelation: 0.8070, p_value: 0.0934, confidence: 'Moderate'}, ///X
    { id: 'COP_CVX', name: 'COP / CVX', Coorelation: 0.8208, p_value: 0.0730, confidence: 'Moderate'}, ///X
    { id: 'COP_EOG', name: 'COP / EOG', Coorelation: 0.8756, p_value: 0.0086, confidence: 'High'}, ///X
    { id: 'COP_SLB', name: 'COP / SLB', Coorelation: 0.7834, p_value: 0.0433, confidence: 'High'}, ///X
    { id: 'GS_MS', name: 'GS / MS', Coorelation: 0.9157, p_value: 0.0792, confidence: 'Moderate'}, ///X
    { id: 'GS_WFC', name: 'GS / WFC', Coorelation: 0.7692, p_value: 0.0301, confidence: 'High'}, ///X
    { id: 'JPM_WFC', name: 'JPM / WFC', Coorelation: 0.7590, p_value: 0.0586, confidence: 'Moderate'}, ///X
    { id: 'HD_LOW', name: 'HD / LOW', Coorelation: 0.8845, p_value: 0.0652, confidence: 'Moderate'}, ///X
    { id: 'MS_WFC', name: 'MS / WFC', Coorelation: 0.7989, p_value: 0.0493, confidence: 'High'} ///X
];


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