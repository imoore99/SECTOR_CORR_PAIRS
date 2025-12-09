

const dropdownTag = document.querySelector('.pair-dropdown');

allPairs.forEach((pair, index) => {
    const optionTag = document.createElement('option');
    optionTag.value = pair.id;
    optionTag.innerHTML = pair.name;
    dropdownTag.appendChild(optionTag);
});

// Set initial display values
const initialPairData = sampleCurrentSignals[0];
console.log('Initial pair data:', initialPairData.pair_name);
document.querySelector('.pair-call-out').innerHTML = initialPairData.pair_name;
document.querySelector('.pair-action').innerHTML = initialPairData.signal_direction === 'SELL_BUY' ? `🔴 SELL ${initialPairData.stock1} / BUY ${initialPairData.stock2}` : `🟢 BUY ${initialPairData.stock1} / SELL ${initialPairData.stock2}`;
document.querySelector('.pair-z-score').innerHTML = initialPairData.z_score >= 0 ? `Z-SCORE: +${initialPairData.z_score} ▲` : `Z-SCORE: ${initialPairData.z_score} ▼`;

document.querySelector('.p-value-decimal').innerHTML = `${initialPairData.p_value}`;
document.querySelector('.p-value-confidence').innerHTML = `${initialPairData.confidence}` + ` Confidence`;
document.querySelector('.p-value-stars').innerHTML = initialPairData.confidence === 'High' ? '⭐⭐⭐' : initialPairData.confidence === 'Medium' ? '⭐⭐' : '⭐';

document.querySelector('.signal-strength-indicator').innerHTML = `${initialPairData.signal_strength}`;
document.querySelector('.signal-status-position').innerHTML = initialPairData.status === 'IN_RANGE' ? 'IN RANGE': `${initialPairData.status}`;
document.querySelector('.signal-status-days').innerHTML = ` (${initialPairData.days_diverged} Days)`;

document.querySelector('.chart-header-pair').innerHTML = initialPairData.pair_name;

// Function to update pair details from dropdown selection
function updatePairDetails(pairData) {
    document.querySelector('.pair-call-out').innerHTML = pairData.pair_name;
    document.querySelectorAll('.chart-header-pair').forEach(element => {
        element.innerHTML = pairData.pair_name;
    });
    console.log(pairData.signal_direction);
    document.querySelector('.pair-action').innerHTML = pairData.signal_direction === 'SELL_BUY' ? `🔴 SELL ${pairData.stock1} / BUY ${pairData.stock2}` : `🟢 BUY ${pairData.stock1} / SELL ${pairData.stock2}`;
    document.querySelector('.pair-z-score').innerHTML = pairData.z_score >= 0 ? `Z-SCORE: +${pairData.z_score} ▲` : `Z-SCORE: ${pairData.z_score} ▼`;

    document.querySelector('.p-value-decimal').innerHTML = `${pairData.p_value}`;
    document.querySelector('.p-value-confidence').innerHTML = `${pairData.confidence}` + ` Confidence`;
    document.querySelector('.p-value-stars').innerHTML = pairData.confidence === 'High' ? '⭐⭐⭐' : pairData.confidence === 'Medium' ? '⭐⭐' : '⭐';

    document.querySelector('.signal-strength-indicator').innerHTML = `${pairData.signal_strength}`;
    document.querySelector('.signal-status-position').innerHTML = pairData.status === 'IN_RANGE' ? 'IN RANGE': `${pairData.status}`;
    document.querySelector('.signal-status-days').innerHTML = ` (${pairData.days_diverged} Days)`;
};


dropdownTag.addEventListener('change', function() {
    const selectedPairId = this.value;  // e.g., "AXP_BAC"


    console.log('This is the value:', selectedPairId);
    
    // Find the data for this pair
    const pairData = sampleCurrentSignals.find(pair => pair.pair_id === selectedPairId);
    console.log('Pair data:', pairData);

    // Update the page
    updatePairDetails(pairData);  // Pass the whole data object, not just index
});


