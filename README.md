# 2025 Crop Planner - M77 AG

Cost planning tool for corn operations in northeastern Colorado. Uses **75% of spread** methodology with rates from CSU and Iowa State 2025 surveys.

## Overview

- **960 total acres** - Irrigated and dryland corn
- Custom rates at 75th percentile of reported range
- Complete cost tracking with detailed breakdowns
- Revenue projections and breakeven analysis

## 2025 Crop Plan

| Crop | Type | Acres | Target Yield | Cost/Acre | Breakeven |
|------|------|-------|--------------|-----------|-----------|
| Corn | Irrigated | 360 | 200 bu/ac | $1,048.95 | $5.24/bu |
| Corn | Dryland | 600 | 80 bu/ac | $487.35 | $6.09/bu |

## Cost Methodology

All custom operation rates use the **75% of spread** formula:

```
Rate = Low + 0.75 × (High - Low)
```

Example: Disking reported at $10-$20/acre = $10 + (0.75 × $10) = **$17.50/acre**

## Operations (75% of Spread)

| Operation | Range | Rate | Source |
|-----------|-------|------|--------|
| Disking | $10-$20 | $17.50/ac | Iowa State 2025 |
| Strip Tillage | $14-$30 | $26.00/ac | Iowa State 2025 |
| Corn Planting | $15-$42 | $35.00/ac | Iowa State 2025 |
| Spraying | $5-$15 | $12.50/ac | Iowa State 2025 |
| Corn Combine | $25-$80 | $66.25/ac | Iowa State 2025 |
| Grain Cart | $5-$22 | $17.75/ac | Iowa State 2025 |

## Irrigated Corn Program (360 acres)

**Operations:** Disk x2, Strip Till, Plant, Spray x3, Harvest = $225.50/ac

**Fertilizer (220N-40P-25S):**
- Anhydrous @ $825/ton = $110.66 (220 lbs N)
- DAP @ $675/ton = $29.36 (40 lbs P2O5)
- AMS @ $350/ton = $18.23 (25 lbs S)
- Total: $174.75/ac

**Chemical (3-pass: Valor, Atrazine, Metolachlor, Acetochlor):**
- Pass 1: Burndown/Pre = $29.00/ac
- Pass 2: Pre-emergence = $25.43/ac
- Pass 3: Early Post = $27.88/ac
- Total: $82.31/ac

**Irrigation:** 12" @ $6.50/inch + repairs + labor = $103.00/ac

## Data Sources

- [Iowa State 2025 Farm Custom Rate Survey](https://www.extension.iastate.edu/agdm/crops/html/a3-10.html)
- [CSU Extension 2024 Custom Rates for Colorado](https://abm.extension.colostate.edu/custom-rates-survey/)
- USDA AMS Production Cost Reports (Nov 2025)

## File Structure

```
/
├── index.html          # Dashboard with summary stats
├── css/style.css       # Dark theme styling
├── js/main.js          # Page rendering logic
├── data/
│   ├── crops.js        # 960 acres (360 irrigated, 600 dryland)
│   └── costs.js        # 75% spread rates, fertilizer, chemicals
└── pages/
    ├── costs.html      # Detailed cost breakdown
    ├── inputs.html     # Operations, fertilizer, chemical details
    ├── projections.html # Revenue and breakeven analysis
    └── offer.html      # Rate sources and methodology
```

## Deployment

Designed for GitHub Pages. Enable Pages in repository settings.

## Location

M77 AG - Haxtun, Colorado
Serving Phillips, Sedgwick, Logan, and Yuma Counties
