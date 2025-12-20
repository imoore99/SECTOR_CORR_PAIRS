

const tableSelectPairs = document.querySelector('.selected-pairs-table-body')

allPairs.forEach(data => {
    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = data.name;
    newRow.append(nameCell);

    const corrCell = document.createElement('td');
    corrCell.textContent = data.Coorelation;
    newRow.append(corrCell);

    const pvalueCell = document.createElement('td');
    pvalueCell.textContent = data.p_value;
    newRow.append(pvalueCell);

    const confidenceCell = document.createElement('td');
    confidenceCell.textContent = data.confidence;
    newRow.append(confidenceCell);

    // Append the completed row to the table body
    tableSelectPairs.append(newRow);
    
});

// use data from sampleCurrentSignals
//may need to run API formatting here too
//need to add days count function
///for each
////const newBlock 'div'
////add div class='current-signals-flex'
////add div to 'current-signals-flex' div class = 'current-signal-badge'
/////add p to div 'current-signal-badge' class = "current-signal-badge-header" data.name
/////add p to div 'current-signal-badge' class = "current-signal-status" data.status
/////add p to div 'current-signal-badge' data.z_score
/////add p to div 'current-signal-badge' data.days
/////add p to div 'current-signal-badge' data.confidence
/////background color needs to be dependent on z_score -> use same scaling as heatmap