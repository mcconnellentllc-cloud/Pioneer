# 2025 Crop Planner - M77 AG

Static website for M77 AG crop planning operations in northeastern Colorado. Tracks costs, inputs, revenue projections, and generates custom farming/lease offers.

## Overview

This planning tool helps manage:
- **2,640 total acres** across multiple crops
- Irrigated and dryland operations
- Complete cost tracking (seed, fertilizer, chemicals, overhead)
- Revenue projections and breakeven analysis
- Custom farming rate cards

## Crops Planned for 2025

| Crop | Type | Acres | Target Yield |
|------|------|-------|--------------|
| Corn | Irrigated | 640 | 210 bu/ac |
| Corn | Dryland | 480 | 75 bu/ac |
| Winter Wheat | Dryland | 800 | 35 bu/ac |
| Grain Sorghum | Dryland | 320 | 65 bu/ac |
| Grain Sorghum | Irrigated | 160 | 130 bu/ac |
| Sunflowers | Dryland | 240 | 1,400 lbs/ac |

## File Structure

```
/
├── index.html          # Dashboard with summary stats
├── css/style.css       # Dark theme styling
├── js/main.js          # Page rendering logic
├── data/
│   ├── crops.js        # Crop acres, yields, prices
│   └── costs.js        # Input costs, rates, overhead
└── pages/
    ├── costs.html      # Detailed cost breakdown
    ├── inputs.html     # Seed, fertilizer, chemical details
    ├── projections.html # Revenue and profit projections
    └── offer.html      # Custom farming rate card
```

## Usage

1. Edit `data/crops.js` to update planned acres and yield goals
2. Edit `data/costs.js` to update input prices and rates
3. View the dashboard for updated summaries and projections

## Deployment

Designed for GitHub Pages. Enable Pages in repository settings and select this branch.

## Location

M77 AG operates in:
- Phillips County
- Sedgwick County
- Logan County
- Yuma County

Based in Haxtun, Colorado.
