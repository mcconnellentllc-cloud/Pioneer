// 2025 Crop Planning Data - M77 AG
// Northeastern Colorado Operations (Phillips, Sedgwick, Logan, Yuma counties)
// Edit these values as plans develop

const CROPS = [
    {
        id: 'corn-irrigated',
        name: 'Corn',
        type: 'Irrigated',
        acres: 640,         // Planned irrigated corn acres
        yieldGoal: 210,     // bu/acre target - good pivot ground
        priceTarget: 4.40,  // $/bu - 2025 forward contract range
    },
    {
        id: 'corn-dryland',
        name: 'Corn',
        type: 'Dryland',
        acres: 480,         // Planned dryland corn acres
        yieldGoal: 75,      // bu/acre target - NE CO avg
        priceTarget: 4.40,
    },
    {
        id: 'wheat-dryland',
        name: 'Wheat',
        type: 'Dryland',
        acres: 800,         // Planned winter wheat acres
        yieldGoal: 35,      // bu/acre target - NE CO avg
        priceTarget: 5.75,  // HRW wheat price
    },
    {
        id: 'milo-dryland',
        name: 'Grain Sorghum',
        type: 'Dryland',
        acres: 320,         // Planned dryland milo acres
        yieldGoal: 65,      // bu/acre target
        priceTarget: 4.20,
    },
    {
        id: 'milo-irrigated',
        name: 'Grain Sorghum',
        type: 'Irrigated',
        acres: 160,         // Limited irrigated milo
        yieldGoal: 130,     // bu/acre target
        priceTarget: 4.20,
    },
    {
        id: 'sunflowers-dryland',
        name: 'Sunflowers',
        type: 'Dryland',
        acres: 240,         // Oil sunflowers
        yieldGoal: 1400,    // lbs/acre
        priceTarget: 0.24,  // $/lb confection/oil
    },
];

function getCrop(id) {
    return CROPS.find(c => c.id === id);
}

function getTotalAcres() {
    return CROPS.reduce((sum, c) => sum + c.acres, 0);
}

function getIrrigatedAcres() {
    return CROPS.filter(c => c.type === 'Irrigated').reduce((sum, c) => sum + c.acres, 0);
}

function getDrylandAcres() {
    return CROPS.filter(c => c.type === 'Dryland').reduce((sum, c) => sum + c.acres, 0);
}
