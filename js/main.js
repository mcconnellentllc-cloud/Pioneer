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
        row.innerHTML = `<td colspan="6" class="text-muted" style="text-align:center;padding:2rem;">No crops planned yet. Update data/crops.js to add acres.</td>`;
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

    // Add total row
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

    // Seed section
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

    // Fertilizer section
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

    // Chemicals section
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

    // Overall summary
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

function updateOfferPage() {
    const content = document.getElementById('offer-content');

    const rates = CUSTOM_FARMING_RATES;
    const lease = LEASE_RATES;

    let html = `
    <div class="two-column">
        <div class="offer-section">
            <h3>Custom Farming Rates - 2025</h3>
            <table class="rate-table">
                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">TILLAGE</td></tr>
                <tr><td>Chisel Plow</td><td>$${rates.tillage.chiselPlow}/ac</td></tr>
                <tr><td>Disk</td><td>$${rates.tillage.disk}/ac</td></tr>
                <tr><td>Field Cultivator</td><td>$${rates.tillage.fieldCultivator}/ac</td></tr>
                <tr><td>Vertical Till</td><td>$${rates.tillage.verticalTill}/ac</td></tr>

                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">PLANTING</td></tr>
                <tr><td>Corn/Milo (row crop planter)</td><td>$${rates.planting.rowCrop}/ac</td></tr>
                <tr><td>Wheat/Small Grain (drill)</td><td>$${rates.planting.drill}/ac</td></tr>

                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">APPLICATION</td></tr>
                <tr><td>Spraying</td><td>$${rates.application.sprayer}/ac</td></tr>
                <tr><td>Fertilizer Spreading</td><td>$${rates.application.fertilizer}/ac</td></tr>
                <tr><td>Anhydrous Application</td><td>$${rates.application.anhydrous}/ac</td></tr>
                <tr><td>Sidedress</td><td>$${rates.application.sidedress}/ac</td></tr>

                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">HARVEST</td></tr>
                <tr><td>Corn Combining</td><td>$${rates.harvest.cornBase}/ac + $${rates.harvest.cornPerBu}/bu</td></tr>
                <tr><td>Wheat Combining</td><td>$${rates.harvest.wheatBase}/ac + $${rates.harvest.wheatPerBu}/bu</td></tr>
                <tr><td>Milo Combining</td><td>$${rates.harvest.miloBase}/ac + $${rates.harvest.miloPerBu}/bu</td></tr>
                <tr><td>Grain Cart</td><td>$${rates.harvest.grainCart}/ac</td></tr>

                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">HAULING</td></tr>
                <tr><td>Grain Hauling</td><td>$${rates.hauling.perBushel}/bu + $${rates.hauling.perMile}/mi</td></tr>
            </table>
        </div>

        <div class="offer-section">
            <h3>Land Lease Rates - 2025</h3>
            <table class="rate-table">
                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">CASH RENT</td></tr>
                <tr><td>Irrigated (center pivot)</td><td>$${lease.cashRent.irrigated}/ac</td></tr>
                <tr><td>Dryland (good soil)</td><td>$${lease.cashRent.drylandGood}/ac</td></tr>
                <tr><td>Dryland (average)</td><td>$${lease.cashRent.drylandAverage}/ac</td></tr>
                <tr><td>Pasture/Grass</td><td>$${lease.cashRent.pasture}/ac</td></tr>

                <tr><td colspan="2" style="color: var(--text-muted); font-weight: 600; padding-top: 1rem;">CROP SHARE</td></tr>
                <tr><td>Landlord Share (typical)</td><td>${(lease.cropShare.landlordShare * 100).toFixed(0)}%</td></tr>
                <tr><td>Landlord Pays</td><td>${lease.cropShare.landlordPays}</td></tr>
            </table>

            <div class="notes mt-2">
                <strong>Notes:</strong> ${lease.notes}
            </div>
        </div>
    </div>

    <div class="highlight-box">
        <h3 style="margin-bottom: 1rem;">Full Service Custom Farming Package</h3>
        <p style="margin-bottom: 1rem;">M77 AG offers complete custom farming services for landowners who want professional management without the hassle. Our full-service package includes:</p>
        <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
            <li>All tillage and field preparation</li>
            <li>Planting with premium Pioneer seed</li>
            <li>Fertilizer and chemical application</li>
            <li>Crop scouting and management</li>
            <li>Harvest and grain handling</li>
            <li>Marketing assistance through West Central</li>
        </ul>
        <p><strong>Contact:</strong> Kyle McConnell | M77 AG | Haxtun, CO</p>
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
