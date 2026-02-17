document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and run appropriate functions
    if (document.getElementById('crop-table')) {
        updateDashboard();
    }
    if (document.getElementById('costs-table')) {
        updateCostsPage();
    }
    if (document.getElementById('inputs-content')) {
        updateInputsPage();
    }
    if (document.getElementById('projections-content')) {
        updateProjectionsPage();
    }
    if (document.getElementById('offer-content')) {
        updateOfferPage();
    }

    // Member login form on members.html page
    const memberLoginForm = document.getElementById('memberLoginForm');
    if (memberLoginForm) {
        memberLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('memberPassword').value;
            if (password === 'mcconnell') {
                localStorage.setItem('memberAuth', 'true');
                window.location.href = 'seedbook.html';
            } else {
                alert('Incorrect password. Please try again.');
            }
        });
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

    // Weighted breakeven for all corn
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
        const breakeven = calculateBreakeven(crop.id);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.name}</td>
            <td>${crop.type}</td>
            <td class="number">${crop.acres.toLocaleString()}</td>
            <td class="number">${crop.yieldGoal} bu/ac</td>
            <td class="number">$${costPerAcre.toFixed(2)}</td>
            <td class="number">$${breakeven.toFixed(2)}/bu</td>
            <td class="number">$${totalCropCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
        `;
        tbody.appendChild(row);
    });

    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.className = 'summary-row';
    totalRow.innerHTML = `
        <td colspan="2"><strong>TOTAL</strong></td>
        <td class="number"><strong>${totalAcres.toLocaleString()}</strong></td>
        <td colspan="3"></td>
        <td class="number"><strong>$${totalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong></td>
    `;
    tbody.appendChild(totalRow);
}

function updateCostsPage() {
    const tbody = document.getElementById('costs-table');
    tbody.innerHTML = '';

    let grandTotal = 0;

    CROPS.forEach(crop => {
        if (crop.acres === 0) return;

        const costs = COSTS[crop.id];
        if (!costs) return;

        const totalCost = costs.totalCostPerAcre * crop.acres;
        grandTotal += totalCost;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.name} (${crop.type})</td>
            <td class="number">${crop.acres.toLocaleString()}</td>
            <td class="number">$${costs.operations.subtotal.toFixed(2)}</td>
            <td class="number">$${costs.inputs.subtotal.toFixed(2)}</td>
            <td class="number">$${(costs.irrigation?.subtotal || 0).toFixed(2)}</td>
            <td class="number">$${costs.overhead.subtotal.toFixed(2)}</td>
            <td class="number">$${costs.interest.toFixed(2)}</td>
            <td class="number"><strong>$${costs.totalCostPerAcre.toFixed(2)}</strong></td>
            <td class="number"><strong>$${totalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong></td>
        `;
        tbody.appendChild(row);
    });

    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.className = 'summary-row';
    totalRow.innerHTML = `
        <td colspan="8"><strong>TOTAL</strong></td>
        <td class="number"><strong>$${grandTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong></td>
    `;
    tbody.appendChild(totalRow);
}

function updateInputsPage() {
    const content = document.getElementById('inputs-content');

    // Operations breakdown
    let opsHtml = '<div class="cost-category"><h3>Field Operations (75% of Spread)</h3><table class="data-table"><thead><tr><th>Operation</th><th>Rate/Acre</th><th>Range</th><th>Source</th></tr></thead><tbody>';

    // Tillage
    opsHtml += `<tr><td colspan="4" style="background: var(--bg-card-hover); color: var(--accent); font-weight: 600;">TILLAGE</td></tr>`;
    opsHtml += `<tr><td>Disking</td><td class="number">$${OPERATIONS.tillage.disk.rate.toFixed(2)}</td><td class="number">$${OPERATIONS.tillage.disk.range.low} - $${OPERATIONS.tillage.disk.range.high}</td><td>${OPERATIONS.tillage.disk.source}</td></tr>`;
    opsHtml += `<tr><td>Strip Tillage</td><td class="number">$${OPERATIONS.tillage.stripTill.rate.toFixed(2)}</td><td class="number">$${OPERATIONS.tillage.stripTill.range.low} - $${OPERATIONS.tillage.stripTill.range.high}</td><td>${OPERATIONS.tillage.stripTill.source}</td></tr>`;

    // Planting
    opsHtml += `<tr><td colspan="4" style="background: var(--bg-card-hover); color: var(--accent); font-weight: 600;">PLANTING</td></tr>`;
    opsHtml += `<tr><td>Corn Planting</td><td class="number">$${OPERATIONS.planting.corn.rate.toFixed(2)}</td><td class="number">$${OPERATIONS.planting.corn.range.low} - $${OPERATIONS.planting.corn.range.high}</td><td>${OPERATIONS.planting.corn.source}</td></tr>`;

    // Application
    opsHtml += `<tr><td colspan="4" style="background: var(--bg-card-hover); color: var(--accent); font-weight: 600;">APPLICATION</td></tr>`;
    opsHtml += `<tr><td>Spraying</td><td class="number">$${OPERATIONS.application.spray.rate.toFixed(2)}</td><td class="number">$${OPERATIONS.application.spray.range.low} - $${OPERATIONS.application.spray.range.high}</td><td>${OPERATIONS.application.spray.source}</td></tr>`;
    opsHtml += `<tr><td>Anhydrous Application</td><td class="number">$${OPERATIONS.application.anhydrous.rate.toFixed(2)}</td><td class="number">$${OPERATIONS.application.anhydrous.range.low} - $${OPERATIONS.application.anhydrous.range.high}</td><td>${OPERATIONS.application.anhydrous.source}</td></tr>`;

    // Harvest
    opsHtml += `<tr><td colspan="4" style="background: var(--bg-card-hover); color: var(--accent); font-weight: 600;">HARVEST</td></tr>`;
    opsHtml += `<tr><td>Corn Combine</td><td class="number">$${OPERATIONS.harvest.cornCombine.rate.toFixed(2)}</td><td class="number">$${OPERATIONS.harvest.cornCombine.range.low} - $${OPERATIONS.harvest.cornCombine.range.high}</td><td>${OPERATIONS.harvest.cornCombine.source}</td></tr>`;
    opsHtml += `<tr><td>Grain Cart</td><td class="number">$${OPERATIONS.harvest.grainCart.rate.toFixed(2)}</td><td class="number">$${OPERATIONS.harvest.grainCart.range.low} - $${OPERATIONS.harvest.grainCart.range.high}</td><td>${OPERATIONS.harvest.grainCart.source}</td></tr>`;

    opsHtml += '</tbody></table></div>';

    // Fertilizer section
    let fertHtml = '<div class="cost-category"><h3>Fertilizer Program</h3>';

    CROPS.forEach(crop => {
        if (crop.acres === 0) return;
        const fert = FERTILIZER[crop.id];
        if (!fert) return;

        fertHtml += `<div class="card mb-2"><h4 style="color: var(--accent); margin-bottom: 1rem;">${crop.name} (${crop.type}) - ${fert.nitrogen}N / ${fert.phosphorus}P / ${fert.sulfur}S</h4>`;
        fertHtml += `<table class="rate-table">
            <tr><td>Nitrogen (${fert.nitrogen} lbs)</td><td>Anhydrous ammonia @ $825/ton</td><td class="number">$${(fert.nitrogen * 0.503).toFixed(2)}</td></tr>
            <tr><td>Phosphorus (${fert.phosphorus} lbs P2O5)</td><td>DAP @ $675/ton</td><td class="number">$${(fert.phosphorus * 0.734).toFixed(2)}</td></tr>
            <tr><td>Sulfur (${fert.sulfur} lbs)</td><td>AMS @ $350/ton</td><td class="number">$${(fert.sulfur * 0.729).toFixed(2)}</td></tr>
            <tr><td><strong>Material Cost</strong></td><td></td><td class="number"><strong>$${fert.materialCost.toFixed(2)}</strong></td></tr>
            <tr><td>Application</td><td>Anhydrous inject</td><td class="number">$${fert.applicationCost.toFixed(2)}</td></tr>
            <tr style="border-top: 2px solid var(--border);"><td><strong>TOTAL</strong></td><td></td><td class="number"><strong>$${fert.totalCostPerAcre.toFixed(2)}/acre</strong></td></tr>
        </table></div>`;
    });
    fertHtml += '</div>';

    // Chemicals section
    let chemHtml = '<div class="cost-category"><h3>Chemical Program - 3-Pass System</h3>';
    chemHtml += '<p class="text-muted mb-2">Valor, Atrazine, Metolachlor, Acetochlor</p>';

    CROPS.forEach(crop => {
        if (crop.acres === 0) return;
        const chem = CHEMICALS[crop.id];
        if (!chem) return;

        chemHtml += `<div class="card mb-2"><h4 style="color: var(--accent); margin-bottom: 1rem;">${crop.name} (${crop.type})</h4>`;
        chemHtml += `<table class="data-table"><thead><tr><th>Pass</th><th>Timing</th><th>Products</th><th>Product Cost</th><th>Application</th><th>Total</th></tr></thead><tbody>`;

        chem.passes.forEach(pass => {
            chemHtml += `<tr>
                <td>${pass.name}</td>
                <td>${pass.timing}</td>
                <td>${pass.products.join(', ')}</td>
                <td class="number">$${pass.costProducts.toFixed(2)}</td>
                <td class="number">$${pass.costApplication.toFixed(2)}</td>
                <td class="number">$${(pass.costProducts + pass.costApplication).toFixed(2)}</td>
            </tr>`;
        });

        chemHtml += `<tr class="summary-row">
            <td colspan="3"><strong>TOTAL</strong></td>
            <td class="number"><strong>$${chem.totalProducts.toFixed(2)}</strong></td>
            <td class="number"><strong>$${chem.totalApplication.toFixed(2)}</strong></td>
            <td class="number"><strong>$${chem.totalCostPerAcre.toFixed(2)}/acre</strong></td>
        </tr></tbody></table></div>`;
    });
    chemHtml += '</div>';

    // Irrigation section
    let irrHtml = '<div class="cost-category"><h3>Irrigation Costs (Electric Pivot)</h3>';
    irrHtml += `<div class="card"><table class="rate-table">
        <tr><td>Energy Cost</td><td>$${IRRIGATION.pivot.energyCostPerInch}/acre-inch</td></tr>
        <tr><td>Water Applied (Corn)</td><td>${IRRIGATION.waterApplied['corn-irrigated']} inches</td></tr>
        <tr><td>Pumping Cost</td><td>$${(IRRIGATION.pivot.energyCostPerInch * IRRIGATION.waterApplied['corn-irrigated']).toFixed(2)}/acre</td></tr>
        <tr><td>Repairs</td><td>$${IRRIGATION.pivot.repairsPerAcre}/acre</td></tr>
        <tr><td>Labor</td><td>$${IRRIGATION.pivot.laborPerAcre}/acre</td></tr>
        <tr style="border-top: 2px solid var(--border);"><td><strong>TOTAL</strong></td><td><strong>$${IRRIGATION.totalPerAcre['corn-irrigated'].toFixed(2)}/acre</strong></td></tr>
    </table></div></div>`;

    content.innerHTML = opsHtml + fertHtml + chemHtml + irrHtml;
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
        const netPerAcre = net / crop.acres;

        totalGross += gross;
        totalCosts += totalCost;

        const netClass = net >= 0 ? 'text-green' : 'text-red';

        html += `
        <div class="projection-card">
            <h4>${crop.name} (${crop.type}) - ${crop.acres.toLocaleString()} acres</h4>
            <table class="rate-table">
                <tr><td>Projected Yield</td><td>${crop.yieldGoal} bu/ac</td></tr>
                <tr><td>Total Production</td><td>${(crop.acres * crop.yieldGoal).toLocaleString()} bu</td></tr>
                <tr><td>Price Target</td><td>$${crop.priceTarget.toFixed(2)}/bu</td></tr>
                <tr><td>Gross Revenue</td><td>$${gross.toLocaleString(undefined, {maximumFractionDigits: 0})}</td></tr>
                <tr><td>Total Costs</td><td>$${totalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td></tr>
                <tr><td>Cost Per Acre</td><td>$${costPerAcre.toFixed(2)}</td></tr>
                <tr><td>Breakeven Price</td><td>$${breakeven.toFixed(2)}/bu</td></tr>
                <tr><td><strong>Net Return</strong></td><td class="${netClass}"><strong>$${net.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong></td></tr>
                <tr><td><strong>Net Per Acre</strong></td><td class="${netClass}"><strong>$${netPerAcre.toFixed(2)}</strong></td></tr>
            </table>
        </div>`;
    });

    html += '</div>';

    // Overall summary
    const totalNet = totalGross - totalCosts;
    const totalAcres = getTotalAcres();
    const netPerAcre = totalAcres > 0 ? totalNet / totalAcres : 0;
    const avgCostPerAcre = totalAcres > 0 ? totalCosts / totalAcres : 0;

    html += `
    <div class="highlight-box">
        <h3 style="margin-bottom: 1rem; color: var(--text-heading);">2025 Projection Summary - ${totalAcres.toLocaleString()} Total Acres</h3>
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
                <span class="text-muted">Avg Cost/Acre</span>
                <div class="projection-value">$${avgCostPerAcre.toFixed(2)}</div>
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

function updateOfferPage() {
    const content = document.getElementById('offer-content');

    let html = `
    <div class="offer-section">
        <h3>Data Sources</h3>
        <table class="rate-table">
            <tr><td>Primary Source</td><td>${RATE_SOURCES.primary}</td></tr>
            <tr><td>Secondary Source</td><td>${RATE_SOURCES.secondary}</td></tr>
            <tr><td>Methodology</td><td>${RATE_SOURCES.methodology}</td></tr>
            <tr><td>Fuel Assumption</td><td>${RATE_SOURCES.fuelAssumption}</td></tr>
        </table>
    </div>

    <div class="two-column">
        <div class="offer-section">
            <h3>Custom Operations Rates (75% of Spread)</h3>
            <table class="rate-table">
                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">TILLAGE</td></tr>
                <tr><td>Disking</td><td>$${OPERATIONS.tillage.disk.rate.toFixed(2)}/ac</td></tr>
                <tr><td>Strip Tillage</td><td>$${OPERATIONS.tillage.stripTill.rate.toFixed(2)}/ac</td></tr>
                <tr><td>Strip Till + Anhydrous</td><td>$${OPERATIONS.tillage.stripTillWithAnhydrous.rate.toFixed(2)}/ac</td></tr>

                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">PLANTING</td></tr>
                <tr><td>Corn (row crop planter)</td><td>$${OPERATIONS.planting.corn.rate.toFixed(2)}/ac</td></tr>

                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">APPLICATION</td></tr>
                <tr><td>Spraying</td><td>$${OPERATIONS.application.spray.rate.toFixed(2)}/ac</td></tr>
                <tr><td>Anhydrous Application</td><td>$${OPERATIONS.application.anhydrous.rate.toFixed(2)}/ac</td></tr>
                <tr><td>Dry Fertilizer Spreading</td><td>$${OPERATIONS.application.dryFertilizer.rate.toFixed(2)}/ac</td></tr>

                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">HARVEST</td></tr>
                <tr><td>Corn Combining</td><td>$${OPERATIONS.harvest.cornCombine.rate.toFixed(2)}/ac</td></tr>
                <tr><td>Grain Cart</td><td>$${OPERATIONS.harvest.grainCart.rate.toFixed(2)}/ac</td></tr>
                <tr><td>Hauling</td><td>$${OPERATIONS.harvest.hauling.perBushel}/bu + $${OPERATIONS.harvest.hauling.perMile}/mi</td></tr>
            </table>
        </div>

        <div class="offer-section">
            <h3>Land Lease Rates - 2025</h3>
            <table class="rate-table">
                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">CASH RENT</td></tr>
                <tr><td>Irrigated (center pivot)</td><td>$${OVERHEAD.landCost.cashRent.irrigated}/ac</td></tr>
                <tr><td>Dryland</td><td>$${OVERHEAD.landCost.cashRent.dryland}/ac</td></tr>
            </table>

            <div class="notes mt-2">
                <strong>Notes:</strong> ${OVERHEAD.landCost.notes}
            </div>
        </div>
    </div>

    <div class="highlight-box">
        <h3 style="margin-bottom: 1rem;">Irrigated Corn Operation Summary (360 acres)</h3>
        <table class="rate-table">
            <tr><td>Disk (2x)</td><td>$${(OPERATIONS.tillage.disk.rate * 2).toFixed(2)}/ac</td></tr>
            <tr><td>Strip Till</td><td>$${OPERATIONS.tillage.stripTill.rate.toFixed(2)}/ac</td></tr>
            <tr><td>Plant</td><td>$${OPERATIONS.planting.corn.rate.toFixed(2)}/ac</td></tr>
            <tr><td>Spray (3 passes)</td><td>$${(OPERATIONS.application.spray.rate * 3).toFixed(2)}/ac</td></tr>
            <tr><td>Harvest + Grain Cart</td><td>$${(OPERATIONS.harvest.cornCombine.rate + OPERATIONS.harvest.grainCart.rate).toFixed(2)}/ac</td></tr>
            <tr style="border-top: 2px solid var(--border);"><td><strong>Operations Total</strong></td><td><strong>$${COSTS['corn-irrigated'].operations.subtotal.toFixed(2)}/ac</strong></td></tr>
        </table>
    </div>
    `;

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
