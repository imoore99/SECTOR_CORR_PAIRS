

const allPairs = [
    { id: 'AXP_BAC', name: 'AXP / BAC' },
    { id: 'AXP_MS', name: 'AXP / MS' },
    { id: 'BAC_MS', name: 'BAC / MS' },
    { id: 'C_GS', name: 'C / GS' },
    { id: 'C_JPM', name: 'C / JPM' },
    { id: 'C_MS', name: 'C / MS' },
    { id: 'C_WFC', name: 'C / WFC' },
    { id: 'COP_CVX', name: 'COP / CVX' },
    { id: 'COP_EOG', name: 'COP / EOG' },
    { id: 'COP_SLB', name: 'COP / SLB' },
    { id: 'GS_MS', name: 'GS / MS' },
    { id: 'GS_WFC', name: 'GS / WFC' },
    { id: 'JPM_WFC', name: 'JPM / WFC' },
    { id: 'HD_LOW', name: 'HD / LOW' },
    { id: 'MS_WFC', name: 'MS / WFC' }
];


// Sample data matching your API response format
const sampleCurrentSignals = [
  {
    pair_id: 'AXP_BAC',
    pair_name: 'AXP / BAC',
    stock1: 'AXP',
    stock2: 'BAC',
    z_score: 2.85,
    status: 'DIVERGED',
    days_diverged: 3,
    signal_direction: 'SELL_BUY',
    p_value: 0.002,
    correlation: 0.772,
    confidence: 'High',
    signal_strength: 'Strong Divergence',
    last_updated: '2024-12-08T18:20:00Z'
  },
  {
    pair_id: 'COP_EOG',
    pair_name: 'COP / EOG',
    stock1: 'COP',
    stock2: 'EOG',
    z_score: -2.14,
    status: 'DIVERGED',
    days_diverged: 1,
    signal_direction: 'BUY_SELL',
    p_value: 0.009,
    correlation: 0.876,
    confidence: 'High',
    signal_strength: 'Strong Divergence',
    last_updated: '2024-12-08T18:20:00Z'
  },
  {
    pair_id: 'C_GS',
    pair_name: 'C / GS',
    stock1: 'C',
    stock2: 'GS',
    z_score: 0.45,
    status: 'IN_RANGE',
    days_diverged: 0,
    signal_direction: null,
    p_value: 0.009,
    correlation: 0.840,
    confidence: 'High',
    signal_strength: 'No Signal',
    last_updated: '2024-12-08T18:20:00Z'
  }
  // Add remaining 12 pairs with live data
];