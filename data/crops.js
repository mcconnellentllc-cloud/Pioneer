// 2025 Crop Planning Data - M77 AG
// Northeastern Colorado Operations
// Based on CSU 2024 and Iowa State 2025 Custom Rate Survey data

const CROPS = [
    {
        id: 'corn-irrigated',
        name: 'Corn',
        type: 'Irrigated',
        acres: 360,
        yieldGoal: 200,      // bu/acre target under pivot
        priceTarget: 4.40,   // $/bu - 2025 forward contract
    },
    {
        id: 'corn-dryland',
        name: 'Corn',
        type: 'Dryland',
        acres: 600,
        yieldGoal: 80,       // bu/acre target - NE CO dryland
        priceTarget: 4.40,
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
