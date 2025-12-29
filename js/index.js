
export function initDashboard(currentSignalsData, allSpreadsData, signalsHistoryData, allPairs) {
    
    const dropdownTag = document.querySelector('.pair-dropdown');

    // If we aren't on the Dashboard page, just exit quietly
    if (!dropdownTag) {
        return; 
    }

    //For dropdown
    allPairs.forEach((pair, index) => {
        const optionTag = document.createElement('option');
        optionTag.value = pair.id;
        optionTag.innerHTML = pair.name;
        dropdownTag.appendChild(optionTag);
    });


    //to transform api data

    function transformApiData(apiData) {

        return {
            pair_id: apiData.pair_id,
            pair_name: `${apiData.stock1} / ${apiData.stock2}`,  // Construct it
            stock1: apiData.stock1,
            stock2: apiData.stock2,
            z_score: apiData.current_z_score,
            status: apiData.signal_status,
            signal_direction: mapSignalToDirection(apiData.signal),
            p_value: apiData.coint_pvalue,
            correlation: apiData.correlation,
            confidence: apiData.confidence,
            signal_strength: deriveSignalStrength(apiData),
            days_diverged: countDaysDiverged(apiData.pair_id, signalsHistoryData)
        };
    }

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
    }

    function deriveSignalStrength(apiData) {
        if (apiData.signal_status === 'DIVERGED') {
            return Math.abs(apiData.z_score) > 2.5 ? 'Strong Divergence' : 'Moderate Divergence';
        }
        return 'No Signal';
    }


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
    }

    function roundUpToNearest25(number) {
            return Math.ceil(number / 25) * 25;
        }

    function rounddownToNearest25(number) {
            return Math.floor(number / 25) * 25;
            
        }

    function colorStroke(number) {
        if (number < 0) {
            return "steelblue"
        } else {
            return "tomato"
        }
    };

    const formatScoreDate = d3.utcFormat("%m-%d-%Y");
    const timestampData = currentSignalsData.slice(-1);
    const updateDate = formatScoreDate(new Date(timestampData[0].last_updated));
    document.querySelector(".update-timestamp").innerHTML = updateDate;


    // transform api data to match html and js structures previously built
    currentSignalsData = currentSignalsData.map(apiData => transformApiData(apiData));


    // Set initial display values
    const initialPairData = currentSignalsData.find(pair => pair.pair_id === 'AXP_BAC');

    // Calculate days diverged
    const days = countDaysDiverged(initialPairData.pair_id, signalsHistoryData);


    //Initial Pair Set on Load
    document.querySelector('.pair-call-out').innerHTML = initialPairData.pair_name;
    document.querySelector('.pair-action').innerHTML = initialPairData.signal_direction === 'NO SIGNAL' ? initialPairData.signal_direction : initialPairData.signal_direction === 'SELL_BUY' ? `🔴 SELL ${initialPairData.stock1} / BUY ${initialPairData.stock2}` : `🟢 BUY ${initialPairData.stock1} / SELL ${initialPairData.stock2}`;
    document.querySelector('.pair-z-score').innerHTML = initialPairData.z_score >= 0 ? `Z-SCORE: +${Math.round(initialPairData.z_score * 1000)/1000} ▲` : `Z-SCORE: ${Math.round(initialPairData.z_score * 1000)/1000} ▼`;
    document.querySelector('.p-value-decimal').innerHTML = `${Math.round(initialPairData.p_value * 10000)/10000}`;
    document.querySelector('.p-value-confidence').innerHTML = `${initialPairData.confidence.toUpperCase()}` + ` CONFIDENCE`;
    document.querySelector('.p-value-stars').innerHTML = initialPairData.confidence === 'high' ? '⭐⭐⭐' : initialPairData.confidence === 'moderate' ? '⭐⭐' : '⭐';
    document.querySelector('.signal-strength-indicator').innerHTML = `${initialPairData.signal_strength}`;
    document.querySelector('.signal-status-position').innerHTML = initialPairData.status === 'IN_RANGE' ? 'IN RANGE': `${initialPairData.status}`;
    document.querySelector('.signal-status-days').innerHTML = ` (${days} Days)`;
    document.querySelector('.chart-header-pair').innerHTML = initialPairData.pair_name;


    // Function to update pair details from dropdown selection
    function updatePairDetails(pairData) {
        document.querySelector('.pair-call-out').innerHTML = pairData.pair_name;
        document.querySelectorAll('.chart-header-pair').forEach(element => {
            element.innerHTML = pairData.pair_name;
        });
        document.querySelector('.pair-action').innerHTML = pairData.signal_direction === 'NO SIGNAL' ? pairData.signal_direction : pairData.signal_direction === 'SELL_BUY' ? `🔴 SELL ${pairData.stock1} / BUY ${pairData.stock2}` : `🟢 BUY ${pairData.stock1} / SELL ${pairData.stock2}`;
        document.querySelector('.pair-z-score').innerHTML = pairData.z_score >= 0 ? `Z-SCORE: +${Math.round(pairData.z_score * 1000)/1000} ▲` : `Z-SCORE: ${Math.round(pairData.z_score * 1000)/1000} ▼`;

        document.querySelector('.p-value-decimal').innerHTML = `${Math.round(pairData.p_value * 1000)/1000}`;
        document.querySelector('.p-value-confidence').innerHTML = `${pairData.confidence.toUpperCase()}` + ` CONFIDENCE`;
        document.querySelector('.p-value-stars').innerHTML = pairData.confidence === 'high' ? '⭐⭐⭐' : pairData.confidence === 'moderate' ? '⭐⭐' : '⭐';

        document.querySelector('.signal-strength-indicator').innerHTML = `${pairData.signal_strength}`;
        document.querySelector('.signal-status-position').innerHTML = pairData.status === 'IN_RANGE' ? 'IN RANGE': `${pairData.status}`;
        document.querySelector('.signal-status-days').innerHTML = ` (${pairData.days_diverged} Days)`;

        // Update z-score indicator bar
        // updateZScoreIndicator(pairData.z_score);
    };



    // Chart dimensions
    const margin = {top: 40, right: 40, bottom: 60, left: 60};
    const width = 800 - margin.left - margin.right;   // 700px
    const height = 500 - margin.top - margin.bottom;  // 400px


    // Initial Normalized Chart Data
    const initialNormalizedChart = allSpreadsData.filter(pair => pair.pair_id === 'AXP_BAC');

    NormalizedChart(initialNormalizedChart, "AXP", "BAC") //Initial Normalized Chart

    zScoreChart(initialNormalizedChart) //Initial z-score chart

    zScoreHeatmap(initialNormalizedChart);

    //////BUILDING HEATMAP HERE

    function zScoreHeatmap(data) {
        const svg = d3.select("svg.z-score-heatmap");
        svg.selectAll("*").remove();
        
        const zscorehistory = data.slice(-7);
        
        // Check if mobile
        const isMobile = window.innerWidth <= 1024;
        const cellWidth = 60;
        const cellHeight = isMobile ? 45 : 60;  // ← Dynamic height
        const dateFontSize = isMobile ? "10px" : "10px";
        const scoreFontSize = isMobile ? "12px" : "15px";
        const dateY = isMobile ? 15 : 20;
        const scoreY = isMobile ? 32 : 40;
        
        const heatmapScale = d3.scaleLinear()
            .domain([-2, -0.1, 0.1, 2])
            .range(["#4682b4", "#b8d0e4", "#ffc0bc", "#fe6b48"]);

        const fontScale = d3.scaleLinear()
            .domain([-4, -1, -0.9, 0, 4])
            .range(["#ffffff", "#ffffff","#293146","#293146", "#293146"]);
        
        const formatScoreDate = d3.utcFormat("%m-%d");

        svg
            .attr("viewBox", `0 0 ${cellWidth * 7} ${cellHeight}`)


    // Create groups
        const heatmapGroups = svg
            .selectAll("g.heatmap")
            .data(zscorehistory)
            .enter()
            .append("g")
            .attr("class", "heatmap")
            .attr("transform", (d, i) => `translate(${i * cellWidth}, 0)`);
        
        // Add rectangles
        heatmapGroups
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", cellWidth - 1)
            .attr("height", cellHeight)
            .style("fill", d => heatmapScale(d.z_score))
            .attr("stroke", "#999")
            .attr("stroke-width", 0.5);
        
        // Add date text
        heatmapGroups
            .append("text")
            .attr("x", cellWidth / 2)
            .attr("y", dateY)  // ← Dynamic position
            .attr("text-anchor", "middle")
            .text(d => formatScoreDate(new Date(d.date)))
            .style("fill", (d, i) => {return fontScale(d.z_score)})
            .style("font-size", dateFontSize);  // ← Dynamic font
        
        // Add z-score value
        heatmapGroups
            .append("text")
            .attr("x", cellWidth / 2)
            .attr("y", scoreY)  // ← Dynamic position
            .attr("text-anchor", "middle")
            .text(d => (Math.round(d.z_score * 100) / 100).toFixed(2))
            .style("fill", (d, i) => {return fontScale(d.z_score)})
            .style("font-size", scoreFontSize);  // ← Dynamic font

    }

    function NormalizedChart(chartData, stock1, stock2) {

        const svgNormChart = d3.select("svg.normalized-chart")
        svgNormChart.selectAll("*").remove();  // ← Remove all old elements


        // used to determine max
        let max = 0;

        for (let i = 0; i < chartData.length; i++) {
            if (chartData[i].stock1_normalized > max) {
                    max = chartData[i].stock1_normalized;
                }
        }

        max = roundUpToNearest25(max)

        // used to determine min
        let min = max;

        for (let i = 0; i < chartData.length; i++) {
            if (chartData[i].stock1_normalized < min) {
                    min = chartData[i].stock1_normalized;
                }
        }

        min = rounddownToNearest25(min)

        const length = (max-min) / 25;

        const xtickRange = [min-25, ];
        for (let i = 0; i < length+1; i++) {
        const calculatedValue = min + i * 25; // Example calculation (squares of indices)
        xtickRange.push(calculatedValue); // Push the result of the calculation
        }
        //generate svg chart
        svgNormChart
            .attr("viewBox", "0 0 800 500")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("width", "100%")
            .style("height", "100%")
            

        // Create main group shifted by margins
        const g = svgNormChart.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)

        // Scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(chartData, d => new Date(d.date)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([min-25, max])  // Fixed domain for normalized prices
            .range([height, 0]);  // Inverted: bottom to top

        // X-axis at bottom
        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale)
                .ticks(window.innerWidth < 600 ? 4 : 8) // Half the ticks on mobile
                .tickFormat(d3.timeFormat("%b %y")))
            .style("font-size", "14px")
            .style("color", "white");

        // Y-axis at left
        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale)
                .tickValues(xtickRange))
            .style("font-size", "14px")
            .style("color", "white");

        const stock_1_line = d3.line()
            .x((d, i) => xScale(new Date(d.date)))      // Convert date to x pixel
            .y((d, i) => yScale(d.stock1_normalized))    // Convert value to y pixel

        const stock_2_line = d3.line()
            .x((d, i) => xScale(new Date(d.date)))      // Convert date to x pixel
            .y((d, i) => yScale(d.stock2_normalized))    // Convert value to y pixel

        // Draw lines
        g.append("path")
            .datum(chartData)
            .attr("class", "stock1-line")
            .attr("d", stock_1_line)
            .attr("fill", "none")
            .attr("stroke", "tomato")
            .attr("stroke-width", 2)
            

        g.append("path")
            .datum(chartData)
            .attr("class", "stock2-line")
            .attr("d", stock_2_line)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            
        //building the legend
        g.append("text")
            .attr("x", 20)
            .attr("y", 20)
            .text("-" + stock1)
            .style("font-size", "20px")
            .style("fill", "tomato")

        g.append("text")
            .attr("x", 20)
            .attr("y", 45)
            .text("-" + stock2)
            .style("font-size", "20px")
            .style("fill", "steelblue")
        
        xtickRange.slice(1, length+2).forEach(myFunction);
        
        function myFunction(i, index) {
            g.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(i))
            .attr("y2", yScale(i))
            .attr("stroke", "gray")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "5,5")
            .attr("opacity", 0.6);
        }
    }

    function zScoreChart(chartData, z_score) {

        const svgNormChart = d3.select("svg.z-score-chart")
        svgNormChart.selectAll("*").remove();  // ← Remove all old elements

        // used to determine max
        let max_z_score = 0;

        for (let i = 0; i < chartData.length; i++) {
            if (chartData[i].z_score > max_z_score) {
                    max_z_score = chartData[i].z_score
                }
        }

        const max = Math.ceil(max_z_score)

        // used to determine min
        let min_z_score = 0;

        for (let i = 0; i < chartData.length; i++) {
            if (chartData[i].z_score < min_z_score) {
                    min_z_score = chartData[i].z_score;
                }
        }
        const min = Math.floor(min_z_score)

        const range_length = max - min

        const xtickRange = [min];
        for (let i = 0; i < range_length+1; i++) {
            const calculatedValue = min + i; // Example calculation (squares of indices)
            xtickRange.push(calculatedValue); // Push the result of the calculation
        }

        //generate svg chart
        svgNormChart
            .attr("viewBox", "0 0 800 500")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("width", "100%")
            .style("height", "100%")

        // Create main group shifted by margins
        const g = svgNormChart.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(chartData, d => new Date(d.date)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([min, max])  // Fixed domain for normalized prices
            .range([height, 0]);  // Inverted: bottom to top

        // X-axis at bottom
        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale)
                .ticks(window.innerWidth < 600 ? 4 : 8) // Half the ticks on mobile
                .tickFormat(d3.timeFormat("%b %y")))
            .style("font-size", "14px")
            .style("color", "white");

        // Y-axis at left
        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale)
                .tickValues(xtickRange))
            .style("font-size", "14px")
            .style("color", "white");

        const stock_z_score = d3.line()
            .x((d, i) => xScale(new Date(d.date)))      // Convert date to x pixel
            .y((d, i) => yScale(d.z_score))    // Convert value to y pixel

        // Draw lines
        g.append("path")
            .datum(chartData)
            .attr("class", "stock_z_score")
            .attr("d", stock_z_score)
            .attr("fill", "none")
            .attr("stroke", colorStroke(z_score))
            .attr("stroke-width", 3);

        xtickRange.slice(1, range_length+2).forEach(myFunction);
        
        function myFunction(i, index) {
            g.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", yScale(i))
            .attr("y2", yScale(i))
            .attr("stroke", "gray")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "5,5")
            .attr("opacity", 0.6);
        }
    }


    dropdownTag.addEventListener('change', function() {
        const selectedPairId = this.value;  // e.g., "AXP_BAC"
        
        // Find the data for this pair
        const pairData = currentSignalsData.find(pair => pair.pair_id === selectedPairId);
        const stock_1 = pairData.stock1
        const stock_2 = pairData.stock2
        const z_score = pairData.z_score

        // Update the page
        updatePairDetails(pairData);  // Pass the whole data object, not just index
        
        // Get chart data (spread history) for this pair
        const chartData = allSpreadsData.filter(row => row.pair_id === selectedPairId);

        NormalizedChart(chartData, stock_1, stock_2);

        zScoreChart(chartData, z_score);

        zScoreHeatmap(chartData);
    });

}