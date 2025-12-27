

const tableSelectPairs = document.querySelector('.selected-pairs-table-body')

allPairs.forEach(data => {
    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = data.name;
    newRow.append(nameCell);

    const corrCell = document.createElement('td');
    corrCell.textContent = Math.round(data.Coorelation*1000)/1000;
    newRow.append(corrCell);

    const pvalueCell = document.createElement('td');
    pvalueCell.textContent = Math.round(data.p_value*1000)/1000;
    newRow.append(pvalueCell);

    const confidenceCell = document.createElement('td');
    confidenceCell.textContent = data.confidence;
    newRow.append(confidenceCell);

    // Append the completed row to the table body
    tableSelectPairs.append(newRow);
    
});

function transformApiData(apiData) {

    return {
        pair_id: apiData.pair_id,
        pair_name: `${apiData.stock1} / ${apiData.stock2}`,  // Construct it
        stock1: apiData.stock1,
        stock2: apiData.stock2,
        z_score: apiData.z_score,
        status: apiData.signal_status,
        signal_direction: mapSignalToDirection(apiData.signal),
        p_value: apiData.coint_pvalue,
        correlation: apiData.correlation,
        confidence: apiData.confidence,
        signal_strength: deriveSignalStrength(apiData),
        days_diverged: countDaysDiverged(apiData.pair_id, sampleHistoryData)
    };
};

function mapSignalToDirection(signal) {
    // Map your API's signal format to your expected format
    if (!signal) return signal;

    const sellIndex = signal.indexOf('SELL');
    const buyIndex = signal.indexOf('BUY');

    // If both SELL and BUY are present, check which comes first
    if (sellIndex !== -1 && buyIndex !== -1) {
        return sellIndex < buyIndex ? 'SELL_BUY' : 'BUY_SELL';
    }

    return signal;
};

function deriveSignalStrength(apiData) {
    if (apiData.signal_status === 'DIVERGED') {
        return Math.abs(apiData.z_score) > 2.5 ? 'Strong Divergence' : 'Moderate Divergence';
    }
    return 'No Signal';
};

function countDaysDiverged(pairId, spreadHistory) {
    // Step 1: Get only this pair's history
    const thisPairHistory = spreadHistory.filter(row => row.pair_id === pairId);
    
    // Step 2: Sort newest to oldest
    thisPairHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Step 3: Start counting from most recent day
    let count = 0;
    for (let row of thisPairHistory) {
        // Is this day diverged? (Z-score > 2 or < -2)
        if (Math.abs(row.z_score) >= 2.0) {
            count++;  // Yes, add to count
        } else {
            break;    // No, stop counting
        }
    }
    
    return count;
};

const formatScoreDate = d3.utcFormat("%m-%d-%Y");
const timestampData = sampleCurrentSignals.slice(-1)
console.log(timestampData[0].date)

const updateDate = formatScoreDate(new Date(timestampData[0].date))
document.querySelector(".update-timestamp").innerHTML = updateDate


// transform api data to match html and js structures previously built
sampleCurrentSignals = sampleCurrentSignals.map(apiData => transformApiData(apiData));

console.log(sampleCurrentSignals)

//Selected Pairs Badges

const badgeSelectPairs = document.querySelector(".current-signals-wrapper")

sampleCurrentSignals.forEach(data => {
    const newDiv = document.createElement('div');
    newDiv.className = "current-signal-badge";

    const newP = document.createElement('p');
    newP.className = "current-signal-badge-header";
    newP.textContent = data.pair_name;
    newDiv.appendChild(newP);

    const newStatusP = document.createElement('p');
    newStatusP.className = "current-signal-status";
    newStatusP.textContent = data.status === 'IN_RANGE' ? 'IN RANGE': `${data.status}`;
    newDiv.appendChild(newStatusP);

    const newZScoreP = document.createElement('p');
    newZScoreP.textContent = `Z-SCORE: ${Math.round(data.z_score * 1000)/1000}`;
    newDiv.appendChild(newZScoreP);

    const newDaysP = document.createElement('p');
    newDaysP.textContent = `TIME: ${data.days_diverged} DAYS`;
    newDiv.appendChild(newDaysP);

    const newConP = document.createElement('p');
    newConP.textContent = `CONFIDENCE: ${data.confidence.toUpperCase()}`;
    newDiv.appendChild(newConP);

    newDiv.style.backgroundColor = data.z_score >=2 ? "#fe6b48": data.z_score <= -2 ? "#4682b4": "#445263ff";
    
    

    badgeSelectPairs.append(newDiv);
});

function sumActiveSignals (signalData) {
    let sum = 0;
    signalData.forEach(data => {
        if (data.status === "DIVERGED") {
            sum += 1;
        }
    });
    return sum
};

const activeSignals = sumActiveSignals(sampleCurrentSignals);
const inRangeSignals = 15-activeSignals

let signalDistributionData = [
    {label: "DIVERGED", value: activeSignals},
    {label: "IN RANGE", value: inRangeSignals}
]

console.log(signalDistributionData[1].value)

document.querySelector("p.active-signals").innerHTML = `Active Signals: ${activeSignals} / 15`;

function averageCorrelation (signalData) {
    let corr = 0;
    signalData.forEach(data => {
            corr += data.correlation;
    });
    return Math.round((corr / 15)*1000)/1000
};

document.querySelector("p.avg-corr").innerHTML = `Avg Coorelation: ${averageCorrelation(sampleCurrentSignals)}`;

// Strongest signal (highest abs z-score)
const strongest = sampleCurrentSignals.reduce((max, p) => 
        Math.abs(p.z_score) > Math.abs(max.z_score) ? p : max
    );

document.querySelector("p.strongest-signal").innerHTML = `Strongest Signal: ${strongest.pair_name}`;
document.querySelector("p.days-in-position").innerHTML = `Days in Position: ${strongest.days_diverged} Days`;


const barScale = d3.scaleLinear()
    .domain([0, 15])
    .range([0, 300])

const signalDistribution = d3.select("svg.bar-signal-distribution")
// Create groups and save to variable
const barGroups = signalDistribution
    .selectAll("g.bar-distribution")
    .data(signalDistributionData)
    .enter()
    .append("g")
    .attr("class", "bar-distribution")
    .attr("transform", (d, i) => `translate(0, ${i * 80})`);  // Stack vertically

// Append rect to EACH group
barGroups
    .append("rect")
    .attr("x", 100)
    .attr("y", 0)
    .attr("width", d => barScale(d.value))  // Now 'd' is defined
    .attr("height", 60)
    .style("fill", (d, i) => i === 0 ? "tomato" : "steelblue");

// Add labels to EACH gr25oup
barGroups
    .append("text")
    .attr("x", 5)
    .attr("y", 37)
    .text(d => `${d.label}`)
    .style("fill", "white")
    .style("font-size", "14px");

barGroups
    .append("text")
    .attr("x", (d, i) => { return barScale(d.value) + 80})
    .attr("y", 37)
    .text(d => `${d.value}`)
    .style("fill", "white")
    .style("font-size", "18px");


function calculateRiskMetrics(pairsData) {
    // Max divergence
    const maxDivergence = Math.max(...pairsData.map(p => Math.abs(p.z_score)));
    
    // Average days diverged (only for diverged pairs)
    const divergedPairs = pairsData.filter(p => p.status === 'DIVERGED');
    const avgDays = divergedPairs.length > 0 
        ? divergedPairs.reduce((sum, p) => sum + p.days_diverged, 0) / divergedPairs.length
        : 0;
    
    // Correlation stability
    const avgCorr = pairsData.reduce((sum, p) => sum + p.correlation, 0) / pairsData.length;
    const stability = avgCorr > 0.75 ? 'High' : avgCorr > 0.5 ? 'Moderate' : 'Low';
    
    return {
        maxDivergence: maxDivergence.toFixed(2),
        avgDaysDiverged: avgDays.toFixed(1),
        correlationStability: stability
    };
}

// Usage
const riskMetrics = calculateRiskMetrics(sampleCurrentSignals);
console.log(riskMetrics)

document.querySelector(".max-divergence").innerHTML = `Max Divergence: ${riskMetrics.maxDivergence}σ`;
document.querySelector(".avg-days-diverged").innerHTML = `Avg Days Diverged: ${riskMetrics.avgDaysDiverged} days`;
document.querySelector(".corr-stability").innerHTML = `Correlation Stability: ${riskMetrics.correlationStability}`;

