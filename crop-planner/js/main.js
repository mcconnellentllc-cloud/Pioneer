document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('crop-table')) {
        updateDashboard();
    }
    if (document.getElementById('costs-table')) {
        updateCostsPage();
    }
    if (document.getElementById('inputs-content')) {
        updateInputsPage();
        initCustomInputs();
    }
    if (document.getElementById('projections-content')) {
        updateProjectionsPage();
    }
});

function updateDashboard() {
    const totalAcres = getTotalAcres();
    document.getElementById('total-acres').textContent = totalAcres.toLocaleString();

    let totalCost = 0;
    CROPS.forEach(crop => {
        const costPerAcre = calculateTotalCostPerAcre(crop.id);
        totalCost += costPerAcre * crop.acres;
    });
    document.getElementById('total-cost').textContent = '$' + totalCost.toLocaleString(undefined, {maximumFractionDigits: 0});

    const avgCost = totalAcres > 0 ? totalCost / totalAcres : 0;
    document.getElementById('cost-per-acre').textContent = '$' + avgCost.toFixed(2);

    let weightedBreakeven = 0;
    let cornAcres = 0;
    CROPS.filter(c => c.name === 'Corn').forEach(c => {
        weightedBreakeven += calculateBreakeven(c.id) * c.acres;
        cornAcres += c.acres;
    });
    const avgBreakeven = cornAcres > 0 ? weightedBreakeven / cornAcres : 0;
    document.getElementById('breakeven').textContent = '$' + avgBreakeven.toFixed(2) + '/bu';

    const tbody = document.getElementById('crop-table');
    tbody.innerHTML = '';

    CROPS.forEach(crop => {
        if (crop.acres === 0) return;

        const costPerAcre = calculateTotalCostPerAcre(crop.id);
        const totalCropCost = costPerAcre * crop.acres;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.name}</td>
            <td>${crop.type}</td>
            <td class="number">${crop.acres.toLocaleString()}</td>
            <td class="number">${crop.yieldGoal} ${crop.name === 'Sunflowers' ? 'lbs' : 'bu'}/ac</td>
            <td class="number">$${costPerAcre.toFixed(2)}</td>
            <td class="number">$${totalCropCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
        `;
        tbody.appendChild(row);
    });

    if (tbody.children.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" class="text-muted" style="text-align:center;padding:2rem;">No crops planned yet. Update data/crops.js to add acres.</td>';
        tbody.appendChild(row);
    }
}

function updateCostsPage() {
    const tbody = document.getElementById('costs-table');
    tbody.innerHTML = '';

    let grandTotal = 0;

    CROPS.forEach(crop => {
        if (crop.acres === 0) return;

        const seedCost = COSTS.seed[crop.id]?.costPerAcre || 0;
        const fertCost = COSTS.fertilizer[crop.id]?.totalCostPerAcre || 0;
        const chemCost = COSTS.chemicals[crop.id]?.totalCostPerAcre || 0;
        const insuranceCost = COSTS.overhead.cropInsurance[crop.id] || 0;

        let irrigationCost = 0;
        if (crop.type === 'Irrigated') {
            const inches = COSTS.irrigation.waterApplied[crop.id] || 0;
            irrigationCost = inches * (COSTS.irrigation.pivot.totalPerAcreInch || 0);
            irrigationCost += COSTS.irrigation.pivot.repairsPerAcre || 0;
            irrigationCost += COSTS.irrigation.pivot.laborPerAcre || 0;
        }

        let landCost = crop.type === 'Irrigated'
            ? COSTS.overhead.landCost.cashRent.irrigated
            : COSTS.overhead.landCost.cashRent.dryland;

        const subtotal = seedCost + fertCost + chemCost + insuranceCost + irrigationCost + landCost;
        const interest = subtotal * (COSTS.overhead.interest.operatingRate * (COSTS.overhead.interest.months / 12));
        const misc = COSTS.overhead.miscellaneous.perAcre;
        const totalPerAcre = subtotal + interest + misc;
        const totalForCrop = totalPerAcre * crop.acres;
        grandTotal += totalForCrop;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.name} (${crop.type})</td>
            <td class="number">${crop.acres.toLocaleString()}</td>
            <td class="number">$${seedCost.toFixed(2)}</td>
            <td class="number">$${fertCost.toFixed(2)}</td>
            <td class="number">$${chemCost.toFixed(2)}</td>
            <td class="number">$${insuranceCost.toFixed(2)}</td>
            <td class="number">$${irrigationCost.toFixed(2)}</td>
            <td class="number">$${landCost.toFixed(2)}</td>
            <td class="number">$${(interest + misc).toFixed(2)}</td>
            <td class="number"><strong>$${totalPerAcre.toFixed(2)}</strong></td>
            <td class="number"><strong>$${totalForCrop.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong></td>
        `;
        tbody.appendChild(row);
    });

    const totalRow = document.createElement('tr');
    totalRow.className = 'summary-row';
    totalRow.innerHTML = `
        <td colspan="10"><strong>TOTAL</strong></td>
        <td class="number"><strong>$${grandTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong></td>
    `;
    tbody.appendChild(totalRow);
}

function updateInputsPage() {
    const content = document.getElementById('inputs-content');

    let seedHtml = '<div class="cost-category"><h3>Seed</h3><table class="data-table"><thead><tr><th>Crop</th><th>Variety/Hybrid</th><th>Population</th><th>Price/Bag</th><th>Cost/Acre</th><th>Notes</th></tr></thead><tbody>';

    CROPS.forEach(crop => {
        if (crop.acres === 0) return;
        const seed = COSTS.seed[crop.id];
        if (!seed) return;
        seedHtml += `<tr>
            <td>${crop.name} (${crop.type})</td>
            <td>${seed.hybrid || seed.variety || '-'}</td>
            <td class="number">${seed.population?.toLocaleString() || seed.lbsPerAcre + ' lbs' || '-'}</td>
            <td class="number">$${(seed.pricePerBag || seed.pricePerBushel || 0).toFixed(2)}</td>
            <td class="number">$${seed.costPerAcre.toFixed(2)}</td>
            <td class="text-muted">${seed.notes || ''}</td>
        </tr>`;
    });
    seedHtml += '</tbody></table></div>';

    let fertHtml = '<div class="cost-category"><h3>Fertilizer</h3><table class="data-table"><thead><tr><th>Crop</th><th>N (lbs)</th><th>P (lbs)</th><th>K (lbs)</th><th>S (lbs)</th><th>Zn (lbs)</th><th>Cost/Acre</th><th>Notes</th></tr></thead><tbody>';

    CROPS.forEach(crop => {
        if (crop.acres === 0) return;
        const fert = COSTS.fertilizer[crop.id];
        if (!fert) return;
        fertHtml += `<tr>
            <td>${crop.name} (${crop.type})</td>
            <td class="number">${fert.nitrogen}</td>
            <td class="number">${fert.phosphorus}</td>
            <td class="number">${fert.potassium}</td>
            <td class="number">${fert.sulfur}</td>
            <td class="number">${fert.zinc}</td>
            <td class="number">$${fert.totalCostPerAcre.toFixed(2)}</td>
            <td class="text-muted">${fert.notes || ''}</td>
        </tr>`;
    });
    fertHtml += '</tbody></table></div>';

    let chemHtml = '<div class="cost-category"><h3>Chemicals</h3><table class="data-table"><thead><tr><th>Crop</th><th>Pre-Emerge</th><th>Post-Emerge</th><th>Insecticide</th><th>Fungicide</th><th>Total/Acre</th><th>Notes</th></tr></thead><tbody>';

    CROPS.forEach(crop => {
        if (crop.acres === 0) return;
        const chem = COSTS.chemicals[crop.id];
        if (!chem) return;
        chemHtml += `<tr>
            <td>${crop.name} (${crop.type})</td>
            <td class="number">$${chem.preEmergence.toFixed(2)}</td>
            <td class="number">$${chem.postEmergence.toFixed(2)}</td>
            <td class="number">$${chem.insecticide.toFixed(2)}</td>
            <td class="number">$${chem.fungicide.toFixed(2)}</td>
            <td class="number">$${chem.totalCostPerAcre.toFixed(2)}</td>
            <td class="text-muted">${chem.notes || ''}</td>
        </tr>`;
    });
    chemHtml += '</tbody></table></div>';

    content.innerHTML = seedHtml + fertHtml + chemHtml;
}

function updateProjectionsPage() {
    const content = document.getElementById('projections-content');

    let html = '<div class="summary-grid">';
    let totalGross = 0;
    let totalCosts = 0;

    CROPS.forEach(crop => {
        if (crop.acres === 0) return;

        const gross = calculateGrossRevenue(crop.id);
        const costPerAcre = calculateTotalCostPerAcre(crop.id);
        const totalCost = costPerAcre * crop.acres;
        const net = gross - totalCost;
        const breakeven = calculateBreakeven(crop.id);

        totalGross += gross;
        totalCosts += totalCost;

        const netClass = net >= 0 ? 'text-green' : 'text-red';

        html += `
        <div class="projection-card">
            <h4>${crop.name} (${crop.type}) - ${crop.acres.toLocaleString()} ac</h4>
            <table class="rate-table">
                <tr><td>Projected Yield</td><td>${crop.yieldGoal} ${crop.name === 'Sunflowers' ? 'lbs' : 'bu'}/ac</td></tr>
                <tr><td>Price Target</td><td>$${crop.priceTarget.toFixed(2)}/${crop.name === 'Sunflowers' ? 'lb' : 'bu'}</td></tr>
                <tr><td>Gross Revenue</td><td>$${gross.toLocaleString(undefined, {maximumFractionDigits: 0})}</td></tr>
                <tr><td>Total Costs</td><td>$${totalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td></tr>
                <tr><td>Breakeven</td><td>$${breakeven.toFixed(2)}/${crop.name === 'Sunflowers' ? 'lb' : 'bu'}</td></tr>
                <tr><td><strong>Net Return</strong></td><td class="${netClass}"><strong>$${net.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong></td></tr>
            </table>
        </div>`;
    });

    html += '</div>';

    const totalNet = totalGross - totalCosts;
    const totalAcres = getTotalAcres();
    const netPerAcre = totalAcres > 0 ? totalNet / totalAcres : 0;

    html += `
    <div class="highlight-box">
        <h3 style="margin-bottom: 1rem; color: var(--text-heading);">2025 Projection Summary</h3>
        <div class="summary-grid">
            <div>
                <span class="text-muted">Total Gross Revenue</span>
                <div class="projection-value">$${totalGross.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            </div>
            <div>
                <span class="text-muted">Total Costs</span>
                <div class="projection-value">$${totalCosts.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            </div>
            <div>
                <span class="text-muted">Projected Net Return</span>
                <div class="projection-value ${totalNet >= 0 ? 'text-green' : 'text-red'}">$${totalNet.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            </div>
            <div>
                <span class="text-muted">Net Per Acre</span>
                <div class="projection-value ${netPerAcre >= 0 ? 'text-green' : 'text-red'}">$${netPerAcre.toFixed(2)}</div>
            </div>
        </div>
    </div>`;

    content.innerHTML = html;
}

function formatCurrency(value) {
    return '$' + value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatNumber(value, decimals = 0) {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Custom Inputs functionality
function initCustomInputs() {
    const addBtn = document.getElementById('add-custom-row');
    if (!addBtn) return;

    // Load saved custom inputs from localStorage
    const saved = JSON.parse(localStorage.getItem('customInputs') || '[]');
    saved.forEach(item => addCustomRow(item.description, item.costPerAcre, item.acres));

    // If no saved rows, add 3 empty starter rows
    if (saved.length === 0) {
        for (let i = 0; i < 3; i++) addCustomRow('', 0, 0);
    }

    addBtn.addEventListener('click', function() {
        addCustomRow('', 0, 0);
    });
}

function addCustomRow(description, costPerAcre, acres) {
    const tbody = document.getElementById('custom-inputs-body');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" value="${description}" placeholder="e.g. Hauling, Drying, Cover Crop..." class="custom-desc" style="width:100%;padding:0.5rem;background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--text);font-family:var(--font-main);font-size:0.875rem;"></td>
        <td><input type="number" value="${costPerAcre}" min="0" step="0.01" class="custom-cost" style="width:100px;padding:0.5rem;background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--text);font-family:var(--font-mono);font-size:0.875rem;text-align:right;"></td>
        <td><input type="number" value="${acres}" min="0" step="1" class="custom-acres" style="width:100px;padding:0.5rem;background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--text);font-family:var(--font-mono);font-size:0.875rem;text-align:right;"></td>
        <td class="number custom-row-total" style="font-family:var(--font-mono);">$0</td>
        <td><button class="remove-custom-row" style="background:none;border:none;color:var(--accent-red);cursor:pointer;font-size:1.125rem;padding:0.25rem;" title="Remove">&times;</button></td>
    `;
    tbody.appendChild(row);

    // Attach event listeners
    row.querySelector('.custom-desc').addEventListener('input', saveAndRecalcCustom);
    row.querySelector('.custom-cost').addEventListener('input', saveAndRecalcCustom);
    row.querySelector('.custom-acres').addEventListener('input', saveAndRecalcCustom);
    row.querySelector('.remove-custom-row').addEventListener('click', function() {
        row.remove();
        saveAndRecalcCustom();
    });

    recalcCustomTotals();
}

function recalcCustomTotals() {
    const rows = document.querySelectorAll('#custom-inputs-body tr');
    let grandTotal = 0;
    rows.forEach(row => {
        const cost = parseFloat(row.querySelector('.custom-cost').value) || 0;
        const acres = parseFloat(row.querySelector('.custom-acres').value) || 0;
        const total = cost * acres;
        grandTotal += total;
        row.querySelector('.custom-row-total').textContent = '$' + total.toLocaleString(undefined, {maximumFractionDigits: 0});
    });
    const totalEl = document.getElementById('custom-total');
    if (totalEl) totalEl.textContent = '$' + grandTotal.toLocaleString(undefined, {maximumFractionDigits: 0});
}

function saveAndRecalcCustom() {
    recalcCustomTotals();
    // Save to localStorage
    const rows = document.querySelectorAll('#custom-inputs-body tr');
    const data = [];
    rows.forEach(row => {
        const description = row.querySelector('.custom-desc').value;
        const costPerAcre = parseFloat(row.querySelector('.custom-cost').value) || 0;
        const acres = parseFloat(row.querySelector('.custom-acres').value) || 0;
        if (description || costPerAcre > 0 || acres > 0) {
            data.push({ description, costPerAcre, acres });
        }
    });
    localStorage.setItem('customInputs', JSON.stringify(data));
}
