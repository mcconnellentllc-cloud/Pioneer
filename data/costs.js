// 2025 Input Costs Database - M77 AG
// All costs in $/acre unless noted
// Prices reflect NE Colorado market - ToGoAG, Pioneer, West Central sourcing

const COSTS = {
    seed: {
        'corn-irrigated': {
            hybrid: 'P1082Q, P1185AM',
            population: 34000,
            pricePerBag: 325,
            bagsPerAcre: 0.425,
            costPerAcre: 138.13,  // 325 * 0.425
            notes: 'Pioneer Qrome/AquaMax - top yielding hybrids for pivots'
        },
        'corn-dryland': {
            hybrid: 'P0843AM, P0622AM',
            population: 18000,
            pricePerBag: 310,
            bagsPerAcre: 0.225,
            costPerAcre: 69.75,
            notes: 'Drought tolerant AquaMax, shorter season'
        },
        'wheat-dryland': {
            variety: 'WestBred WB4792, Langin',
            lbsPerAcre: 60,
            pricePerBushel: 14,
            costPerAcre: 14,  // 60 lbs = 1 bu
            notes: 'Certified treated seed'
        },
        'milo-dryland': {
            hybrid: '84P80, DKS37-07',
            population: 35000,
            pricePerBag: 185,
            costPerAcre: 46.25,
            notes: 'Medium maturity for NE CO'
        },
        'milo-irrigated': {
            hybrid: '85P44, DKS54-00',
            population: 55000,
            pricePerBag: 195,
            costPerAcre: 53.63,
            notes: 'Full season, higher yield potential'
        },
        'sunflowers-dryland': {
            hybrid: 'Pioneer P64HE01',
            population: 18000,
            pricePerBag: 285,
            costPerAcre: 34.20,
            notes: 'High oleic, ExpressSun'
        }
    },

    fertilizer: {
        products: {
            anhydrous: { price: 650, unit: '$/ton', notes: '82-0-0' },
            uan32: { price: 380, unit: '$/ton', notes: '32-0-0' },
            uan28: { price: 340, unit: '$/ton', notes: '28-0-0' },
            map: { price: 725, unit: '$/ton', notes: '11-52-0' },
            dap: { price: 680, unit: '$/ton', notes: '18-46-0' },
            potash: { price: 420, unit: '$/ton', notes: '0-0-60' },
            sulfur: { price: 325, unit: '$/ton', notes: 'AMS 21-0-0-24S' },
            zinc: { price: 1.25, unit: '$/lb', notes: 'Zinc sulfate' },
        },
        'corn-irrigated': {
            nitrogen: 200,
            phosphorus: 40,
            potassium: 0,
            sulfur: 20,
            zinc: 1,
            totalCostPerAcre: 142,
            notes: 'Split apply - 120 lbs fall NH3 + 80 lbs UAN sidedress'
        },
        'corn-dryland': {
            nitrogen: 70,
            phosphorus: 25,
            potassium: 0,
            sulfur: 10,
            zinc: 0.5,
            totalCostPerAcre: 58,
            notes: 'Fall anhydrous with starter'
        },
        'wheat-dryland': {
            nitrogen: 45,
            phosphorus: 20,
            potassium: 0,
            sulfur: 8,
            zinc: 0,
            totalCostPerAcre: 42,
            notes: 'Fall apply pre-plant'
        },
        'milo-dryland': {
            nitrogen: 55,
            phosphorus: 20,
            potassium: 0,
            sulfur: 10,
            zinc: 0,
            totalCostPerAcre: 48,
            notes: 'Starter + pre-plant N'
        },
        'milo-irrigated': {
            nitrogen: 110,
            phosphorus: 30,
            potassium: 0,
            sulfur: 15,
            zinc: 0.5,
            totalCostPerAcre: 92,
            notes: 'Split N application'
        },
        'sunflowers-dryland': {
            nitrogen: 50,
            phosphorus: 15,
            potassium: 0,
            sulfur: 10,
            zinc: 0,
            totalCostPerAcre: 38,
            notes: 'Light N - sunflowers efficient'
        }
    },

    chemicals: {
        herbicides: {
            glyphosate: { price: 18, unit: '$/gal', rate: 32, notes: 'Generic Roundup' },
            atrazine: { price: 16, unit: '$/gal', rate: 2, notes: '4L formulation' },
            acetochlor: { price: 48, unit: '$/gal', rate: 1.3, notes: 'Warrant/Harness' },
            dicamba: { price: 85, unit: '$/gal', rate: 0.5, notes: 'Clarity/Status' },
            '24d': { price: 18, unit: '$/gal', rate: 1, notes: 'LV Ester' },
            mesotrione: { price: 8.50, unit: '$/oz', rate: 3, notes: 'Callisto' },
            spartan: { price: 145, unit: '$/gal', rate: 0.375, notes: 'Sulfentrazone for sunflowers' },
        },
        insecticides: {
            bifenthrin: { price: 32, unit: '$/gal', rate: 0.1, notes: 'Brigade' },
            chlorpyrifos: { price: 45, unit: '$/gal', rate: 1, notes: 'Lorsban - if available' },
            transform: { price: 7.50, unit: '$/oz', rate: 1.5, notes: 'Aphids' },
        },
        fungicides: {
            headline: { price: 28, unit: '$/oz', rate: 6, notes: 'Strobilurin' },
            trivapro: { price: 22, unit: '$/oz', rate: 13.7, notes: 'Corn fungicide' },
            prosaro: { price: 18, unit: '$/oz', rate: 6.5, notes: 'Wheat head scab' },
        },
        'corn-irrigated': {
            preEmergence: 28,    // Atrazine + Warrant
            postEmergence: 18,   // Roundup + Callisto
            insecticide: 4,      // As needed
            fungicide: 28,       // Headline/Trivapro
            totalCostPerAcre: 78,
            notes: 'Full program for irrigated'
        },
        'corn-dryland': {
            preEmergence: 22,
            postEmergence: 14,
            insecticide: 2,
            fungicide: 0,        // Skip fungicide dryland
            totalCostPerAcre: 38,
            notes: 'Reduced program'
        },
        'wheat-dryland': {
            preEmergence: 0,
            postEmergence: 12,   // Dicamba + 2,4-D
            insecticide: 3,      // Aphid spray if needed
            fungicide: 18,       // Prosaro for scab
            totalCostPerAcre: 33,
            notes: 'Scout-based applications'
        },
        'milo-dryland': {
            preEmergence: 18,
            postEmergence: 14,
            insecticide: 5,      // Sugarcane aphid
            fungicide: 0,
            totalCostPerAcre: 37,
            notes: 'Watch for aphids'
        },
        'milo-irrigated': {
            preEmergence: 22,
            postEmergence: 16,
            insecticide: 8,
            fungicide: 15,
            totalCostPerAcre: 61,
            notes: 'Full program under pivot'
        },
        'sunflowers-dryland': {
            preEmergence: 32,    // Spartan + Prowl
            postEmergence: 12,
            insecticide: 6,      // Head moths
            fungicide: 0,
            totalCostPerAcre: 50,
            notes: 'ExpressSun herbicide program'
        }
    },

    operations: {
        tillage: {
            chiselPlow: 20,
            disk: 16,
            fieldCultivator: 14,
            verticalTill: 18,
            notes: 'Custom rates for NE CO'
        },
        planting: {
            cornPlanter: 22,
            grainDrill: 16,
            notes: 'Includes RTK guidance'
        },
        application: {
            sprayer: 9,
            fertilizer: 12,
            anhydrous: 16,
            sidedress: 14,
            aerial: 14,
            notes: 'Ground application default'
        },
        harvest: {
            combine: 0,
            cornBase: 38,
            cornPerBushel: 0.12,
            wheatBase: 28,
            wheatPerBushel: 0.14,
            miloBase: 32,
            miloPerBushel: 0.11,
            sunflowerBase: 35,
            sunflowerPerCwt: 0.60,
            notes: 'Includes header, fuel'
        },
        hauling: {
            perBushel: 0.18,
            perMile: 0.04,
            notes: 'To local elevator'
        }
    },

    irrigation: {
        pivot: {
            energyCostPerInch: 6.50,    // Electric pivots
            repairsPerAcre: 12,
            laborPerAcre: 8,
            totalPerAcreInch: 6.50,
            notes: 'Electric center pivot costs'
        },
        waterApplied: {
            'corn-irrigated': 14,
            'milo-irrigated': 10,
        }
    },

    overhead: {
        cropInsurance: {
            'corn-irrigated': 32,
            'corn-dryland': 18,
            'wheat-dryland': 12,
            'milo-dryland': 14,
            'milo-irrigated': 22,
            'sunflowers-dryland': 16,
            notes: 'RP 75% coverage estimates'
        },
        landCost: {
            cashRent: {
                irrigated: 275,     // Good pivot ground
                dryland: 55,        // Average dryland
            },
            shareRent: {
                landlordShare: 0.33,
            },
            notes: 'Phillips/Sedgwick county averages'
        },
        interest: {
            operatingRate: 0.085,   // Current operating loan rates
            months: 6,
            notes: 'Average months financed'
        },
        miscellaneous: {
            perAcre: 8,
            notes: 'Fuel for pickups, office, crop scouting, misc'
        }
    }
};

// Custom farming rates for offer page
const CUSTOM_FARMING_RATES = {
    tillage: {
        chiselPlow: 22,
        disk: 18,
        fieldCultivator: 15,
        verticalTill: 20,
    },
    planting: {
        rowCrop: 24,        // Corn/Milo planter
        drill: 18,          // Wheat drill
    },
    application: {
        sprayer: 10,
        fertilizer: 13,
        anhydrous: 18,
        sidedress: 16,
    },
    harvest: {
        cornBase: 42,
        cornPerBu: 0.14,
        wheatBase: 30,
        wheatPerBu: 0.16,
        miloBase: 36,
        miloPerBu: 0.13,
        grainCart: 8,
    },
    hauling: {
        perBushel: 0.20,
        perMile: 0.05,
    }
};

// Lease rates for offer page
const LEASE_RATES = {
    cashRent: {
        irrigated: 275,         // Per acre pivot
        drylandGood: 65,        // Good dryland soil
        drylandAverage: 50,     // Average dryland
        pasture: 18,            // Native grass
    },
    cropShare: {
        landlordShare: 0.33,
        landlordPays: 'None (tenant pays all expenses)',
    },
    notes: 'Rates competitive for Phillips, Sedgwick, Logan, Yuma counties. Negotiable based on soil quality, water availability, and term length.'
};

function calculateTotalCostPerAcre(cropId) {
    const crop = getCrop(cropId);
    if (!crop) return 0;

    let total = 0;
    total += COSTS.seed[cropId]?.costPerAcre || 0;
    total += COSTS.fertilizer[cropId]?.totalCostPerAcre || 0;
    total += COSTS.chemicals[cropId]?.totalCostPerAcre || 0;
    total += COSTS.overhead.cropInsurance[cropId] || 0;

    if (crop.type === 'Irrigated') {
        const inches = COSTS.irrigation.waterApplied[cropId] || 0;
        total += inches * (COSTS.irrigation.pivot.totalPerAcreInch || 0);
        total += COSTS.irrigation.pivot.repairsPerAcre || 0;
        total += COSTS.irrigation.pivot.laborPerAcre || 0;
    }

    if (crop.type === 'Irrigated') {
        total += COSTS.overhead.landCost.cashRent.irrigated;
    } else {
        total += COSTS.overhead.landCost.cashRent.dryland;
    }

    // Add operating interest
    const months = COSTS.overhead.interest.months;
    const rate = COSTS.overhead.interest.operatingRate;
    total += total * (rate * (months / 12));

    total += COSTS.overhead.miscellaneous.perAcre;

    return total;
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
