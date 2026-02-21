// 2025 Crop Planning Data - M77 AG
// Northeastern Colorado Operations (Phillips, Sedgwick, Logan, Yuma counties)
// Edit these values as plans develop

const CROPS = [
    {
        id: 'corn-irrigated',
        name: 'Corn',
        type: 'Irrigated',
        acres: 640,
        yieldGoal: 210,
        priceTarget: 4.40,
    },
    {
        id: 'corn-dryland',
        name: 'Corn',
        type: 'Dryland',
        acres: 480,
        yieldGoal: 75,
        priceTarget: 4.40,
    },
    {
        id: 'wheat-dryland',
        name: 'Wheat',
        type: 'Dryland',
        acres: 800,
        yieldGoal: 35,
        priceTarget: 5.75,
    },
    {
        id: 'milo-dryland',
        name: 'Grain Sorghum',
        type: 'Dryland',
        acres: 320,
        yieldGoal: 65,
        priceTarget: 4.20,
    },
    {
        id: 'milo-irrigated',
        name: 'Grain Sorghum',
        type: 'Irrigated',
        acres: 160,
        yieldGoal: 130,
        priceTarget: 4.20,
    },
    {
        id: 'sunflowers-dryland',
        name: 'Sunflowers',
        type: 'Dryland',
        acres: 240,
        yieldGoal: 1400,
        priceTarget: 0.24,
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
