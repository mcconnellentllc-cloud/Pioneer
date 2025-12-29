// 2025 Input Costs Database - M77 AG
// Based on CSU 2024 and Iowa State 2025 Custom Rate Survey data
// All custom rates calculated at 75% of reported spread
// Formula: Low + 0.75 × (High - Low)

const RATE_SOURCES = {
    primary: 'Iowa State University 2025 Farm Custom Rate Survey',
    secondary: 'CSU Extension 2024 Custom Rates for Colorado',
    methodology: '75% of spread between low and high reported rates',
    fuelAssumption: '$3.66/gallon diesel (USEIA Feb 2025)',
};

// ============================================
// CUSTOM OPERATIONS - 75% of Spread Values
// ============================================
const OPERATIONS = {
    tillage: {
        disk: {
            rate: 17.50,
            range: { low: 10, high: 20 },
            calculation: '10 + 0.75 × (20 - 10) = $17.50',
            notes: 'Tandem disk, includes fuel & labor',
            source: 'Iowa State 2025'
        },
        stripTill: {
            rate: 26.00,
            range: { low: 14, high: 30 },
            calculation: '14 + 0.75 × (30 - 14) = $26.00',
            notes: 'Strip tillage without fertilizer',
            source: 'Iowa State 2025'
        },
        stripTillWithAnhydrous: {
            rate: 31.00,
            range: { low: 14, high: 30 },
            calculation: '$26 strip till + $5 anhydrous application',
            notes: 'Strip tillage with anhydrous injection',
            source: 'Iowa State 2025'
        },
    },
    planting: {
        corn: {
            rate: 35.00,
            range: { low: 15, high: 42 },
            calculation: '15 + 0.75 × (42 - 15) = $35.25',
            notes: 'Row crop planter with attachments, RTK guidance',
            source: 'Iowa State 2025'
        },
    },
    application: {
        spray: {
            rate: 12.50,
            range: { low: 5, high: 15 },
            calculation: '5 + 0.75 × (15 - 5) = $12.50',
            notes: 'Broadcast spray, self-propelled',
            source: 'Iowa State 2025'
        },
        sprayTallCrop: {
            rate: 13.50,
            range: { low: 6, high: 16 },
            calculation: '6 + 0.75 × (16 - 6) = $13.50',
            notes: 'Broadcast spray on tall crops',
            source: 'Iowa State 2025'
        },
        anhydrous: {
            rate: 16.50,
            range: { low: 12, high: 18 },
            calculation: '12 + 0.75 × (18 - 12) = $16.50',
            notes: 'Anhydrous injection with toolbar',
            source: 'Iowa State 2025'
        },
        dryFertilizer: {
            rate: 7.30,
            notes: 'Dry bulk fertilizer spreading',
            source: 'Iowa State 2025 average'
        },
    },
    harvest: {
        cornCombine: {
            rate: 66.25,
            range: { low: 25, high: 80 },
            calculation: '25 + 0.75 × (80 - 25) = $66.25',
            notes: 'Corn combine only',
            source: 'Iowa State 2025'
        },
        grainCart: {
            rate: 17.75,
            range: { low: 5, high: 22 },
            calculation: '5 + 0.75 × (22 - 5) = $17.75',
            notes: 'In-field grain cart',
            source: 'Iowa State 2025'
        },
        hauling: {
            perBushel: 0.20,
            perMile: 0.05,
            notes: 'Farm to elevator',
            source: 'Iowa State 2025'
        },
    },
};

// ============================================
// FERTILIZER PROGRAM - 2025 Prices
// ============================================
const FERTILIZER = {
    products: {
        anhydrous: {
            price: 825,
            unit: '$/ton',
            analysis: '82-0-0',
            costPerLbN: 0.503,  // $825/2000 × (100/82)
            notes: 'Nov 2025 avg Midwest price',
            source: 'USDA AMS Illinois/Iowa Reports'
        },
        dap: {
            price: 675,
            unit: '$/ton',
            analysis: '18-46-0',
            costPerLbP2O5: 0.734,  // $675/2000 × (100/46)
            notes: '2025 retail pricing'
        },
        ams: {
            price: 350,
            unit: '$/ton',
            analysis: '21-0-0-24S',
            costPerLbS: 0.729,  // $350/2000 × (100/24)
            notes: 'Ammonium sulfate'
        },
        map: {
            price: 700,
            unit: '$/ton',
            analysis: '11-52-0',
            notes: 'Alternative P source'
        },
        urea: {
            price: 525,
            unit: '$/ton',
            analysis: '46-0-0',
            notes: 'Dry N option'
        },
        uan32: {
            price: 340,
            unit: '$/ton',
            analysis: '32-0-0',
            notes: 'Liquid N solution'
        },
    },

    // IRRIGATED CORN: 220N, 40P, 25S
    'corn-irrigated': {
        nitrogen: 220,
        phosphorus: 40,
        potassium: 0,
        sulfur: 25,
        program: {
            // 220 lbs N from anhydrous: 220 × $0.503 = $110.66
            // 40 lbs P2O5 from DAP: 40 × $0.734 = $29.36
            // 25 lbs S from AMS: 25 × $0.729 = $18.23
            anhydrousLbs: 268,  // 220 / 0.82
            dapLbs: 87,         // 40 / 0.46
            amsLbs: 104,        // 25 / 0.24
        },
        materialCost: 158.25,
        applicationCost: 16.50,  // Anhydrous inject
        totalCostPerAcre: 174.75,
        notes: 'Fall anhydrous + spring DAP/AMS broadcast'
    },

    // DRYLAND CORN: Reduced program
    'corn-dryland': {
        nitrogen: 80,
        phosphorus: 25,
        potassium: 0,
        sulfur: 15,
        program: {
            // 80 lbs N from anhydrous: 80 × $0.503 = $40.24
            // 25 lbs P2O5 from DAP: 25 × $0.734 = $18.35
            // 15 lbs S from AMS: 15 × $0.729 = $10.94
            anhydrousLbs: 98,
            dapLbs: 54,
            amsLbs: 63,
        },
        materialCost: 69.53,
        applicationCost: 16.50,
        totalCostPerAcre: 86.03,
        notes: 'Reduced N for dryland yield potential'
    },
};

// ============================================
// CHEMICAL PROGRAM - 3-Pass System
// Valor, Atrazine, Metolachlor, Acetochlor
// ============================================
const CHEMICALS = {
    products: {
        valor: {
            name: 'Valor (Flumioxazin)',
            rate: '2 oz/acre',
            pricePerOz: 4.50,
            costPerAcre: 9.00,
            timing: 'Burndown/Pre',
            notes: 'Broadleaf & grass control, residual'
        },
        atrazine: {
            name: 'Atrazine 4L',
            rate: '1.5 qt/acre',
            pricePerGal: 18.00,
            costPerAcre: 6.75,
            timing: 'Pre-emergence',
            notes: 'Broadleaf control, residual'
        },
        metolachlor: {
            name: 'Metolachlor (Dual II Magnum)',
            rate: '1.3 pt/acre',
            pricePerGal: 38.00,
            costPerAcre: 6.18,
            timing: 'Pre-emergence',
            notes: 'Grass control, residual'
        },
        acetochlor: {
            name: 'Acetochlor (Warrant/Harness)',
            rate: '1.25 qt/acre',
            pricePerGal: 42.00,
            costPerAcre: 13.13,
            timing: 'Pre-emergence',
            notes: 'Extended grass control'
        },
        glyphosate: {
            name: 'Glyphosate 4L',
            rate: '32 oz/acre',
            pricePerGal: 20.00,
            costPerAcre: 5.00,
            timing: 'Burndown/Post',
            notes: 'Non-selective burndown'
        },
        adjuvants: {
            name: 'AMS + Surfactant',
            costPerAcre: 2.50,
            notes: 'Water conditioner + NIS'
        },
    },

    // IRRIGATED CORN - 3 Pass System
    'corn-irrigated': {
        passes: [
            {
                name: 'Pass 1 - Burndown/Pre',
                timing: '14-21 days before plant',
                products: ['Valor 2oz', 'Glyphosate 32oz', 'AMS'],
                costProducts: 16.50,  // Valor $9 + Glyphosate $5 + Adjuvants $2.50
                costApplication: 12.50,
            },
            {
                name: 'Pass 2 - Pre-Emergence',
                timing: 'At planting or within 3 days',
                products: ['Atrazine 1.5qt', 'Metolachlor 1.3pt'],
                costProducts: 12.93,  // Atrazine $6.75 + Metolachlor $6.18
                costApplication: 12.50,
            },
            {
                name: 'Pass 3 - Early Post',
                timing: 'V2-V4 corn',
                products: ['Acetochlor 1.25qt', 'Atrazine 0.5qt'],
                costProducts: 15.38,  // Acetochlor $13.13 + Atrazine $2.25
                costApplication: 12.50,
            },
        ],
        totalProducts: 44.81,
        totalApplication: 37.50,  // 3 passes × $12.50
        totalCostPerAcre: 82.31,
        notes: '3-pass layered residual program for season-long weed control'
    },

    // DRYLAND CORN - 2 Pass System (reduced)
    'corn-dryland': {
        passes: [
            {
                name: 'Pass 1 - Burndown',
                timing: 'Pre-plant',
                products: ['Glyphosate 32oz', 'Atrazine 1qt', 'AMS'],
                costProducts: 12.00,
                costApplication: 12.50,
            },
            {
                name: 'Pass 2 - Pre-Emergence',
                timing: 'At planting',
                products: ['Metolachlor 1pt', 'Acetochlor 1qt'],
                costProducts: 15.00,
                costApplication: 12.50,
            },
        ],
        totalProducts: 27.00,
        totalApplication: 25.00,  // 2 passes × $12.50
        totalCostPerAcre: 52.00,
        notes: '2-pass program for dryland'
    },
};

// ============================================
// IRRIGATION COSTS - Electric Pivot
// ============================================
const IRRIGATION = {
    pivot: {
        energyCostPerInch: 6.50,
        repairsPerAcre: 15.00,
        laborPerAcre: 10.00,
        notes: 'Electric center pivot, 2025 rates'
    },
    waterApplied: {
        'corn-irrigated': 12,  // inches applied
    },
    // 12 inches × $6.50 = $78 pumping
    // + $15 repairs + $10 labor = $103/acre total
    totalPerAcre: {
        'corn-irrigated': 103.00,
    },
};

// ============================================
// SEED COSTS - 2025
// ============================================
const SEED = {
    'corn-irrigated': {
        hybrid: 'Pioneer P1082Q / P1185AM',
        population: 34000,
        seedsPerBag: 80000,
        bagsPerAcre: 0.425,
        pricePerBag: 325,
        costPerAcre: 138.13,
        notes: 'High-yield irrigated hybrids'
    },
    'corn-dryland': {
        hybrid: 'Pioneer P0843AM / P0622AM',
        population: 22000,
        seedsPerBag: 80000,
        bagsPerAcre: 0.275,
        pricePerBag: 310,
        costPerAcre: 85.25,
        notes: 'Drought-tolerant AquaMax hybrids'
    },
};

// ============================================
// OVERHEAD & FIXED COSTS
// ============================================
const OVERHEAD = {
    cropInsurance: {
        'corn-irrigated': 35.00,
        'corn-dryland': 22.00,
        notes: 'RP 75% coverage estimates'
    },
    landCost: {
        cashRent: {
            irrigated: 275,
            dryland: 55,
        },
        notes: 'Phillips/Sedgwick county averages'
    },
    interest: {
        operatingRate: 0.085,
        months: 6,
        notes: 'Operating loan at 8.5%'
    },
    miscellaneous: {
        perAcre: 10.00,
        notes: 'Fuel, scouting, repairs, misc'
    },
};

// ============================================
// COMPLETE COST CALCULATIONS
// ============================================
const COSTS = {
    'corn-irrigated': {
        operations: {
            disk1: 17.50,
            disk2: 17.50,
            stripTill: 26.00,
            plant: 35.00,
            spray3Pass: 37.50,
            harvest: 66.25,
            grainCart: 17.75,
            hauling: 8.00,  // 200 bu × $0.04/bu avg
            subtotal: 225.50,
        },
        inputs: {
            seed: 138.13,
            fertilizer: 174.75,
            chemicals: 44.81,
            subtotal: 357.69,
        },
        irrigation: {
            pumping: 78.00,  // 12" × $6.50
            repairs: 15.00,
            labor: 10.00,
            subtotal: 103.00,
        },
        overhead: {
            insurance: 35.00,
            land: 275.00,
            miscellaneous: 10.00,
            subtotal: 320.00,
        },
        totalBeforeInterest: 1006.19,
        interest: 42.76,  // 1006.19 × 0.085 × (6/12)
        totalCostPerAcre: 1048.95,
    },
    'corn-dryland': {
        operations: {
            disk1: 17.50,
            disk2: 17.50,
            plant: 35.00,
            spray2Pass: 25.00,
            harvest: 66.25,
            grainCart: 17.75,
            hauling: 3.20,  // 80 bu × $0.04/bu avg
            subtotal: 182.20,
        },
        inputs: {
            seed: 85.25,
            fertilizer: 86.03,
            chemicals: 27.00,
            subtotal: 198.28,
        },
        overhead: {
            insurance: 22.00,
            land: 55.00,
            miscellaneous: 10.00,
            subtotal: 87.00,
        },
        totalBeforeInterest: 467.48,
        interest: 19.87,  // 467.48 × 0.085 × (6/12)
        totalCostPerAcre: 487.35,
    },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function calculateTotalCostPerAcre(cropId) {
    return COSTS[cropId]?.totalCostPerAcre || 0;
}

function calculateBreakeven(cropId) {
    const crop = getCrop(cropId);
    if (!crop || !crop.yieldGoal) return 0;
    const costPerAcre = calculateTotalCostPerAcre(cropId);
    return costPerAcre / crop.yieldGoal;
}

function calculateGrossRevenue(cropId) {
    const crop = getCrop(cropId);
    if (!crop) return 0;
    return crop.acres * crop.yieldGoal * crop.priceTarget;
}

function calculateNetReturn(cropId) {
    const crop = getCrop(cropId);
    if (!crop) return 0;
    const gross = calculateGrossRevenue(cropId);
    const costs = calculateTotalCostPerAcre(cropId) * crop.acres;
    return gross - costs;
}

// Export for page access
const CUSTOM_FARMING_RATES = OPERATIONS;
const LEASE_RATES = {
    cashRent: OVERHEAD.landCost.cashRent,
    notes: 'Based on CSU 2024 and Iowa State 2025 survey data'
};
