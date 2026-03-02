# CLAUDE.md — Pioneer / YourAgInfo.com

## Project Overview

Agricultural information portal and crop planning tool for **McConnell Enterprises** in Haxtun, Colorado. The site serves Pioneer seed customers across Phillips, Sedgwick, Logan, and Yuma Counties in Northeast Colorado.

- **Live domain:** youraginfo.com (GitHub Pages)
- **Repository:** mcconnellentllc-cloud/Pioneer
- **Production branch:** master (auto-deploys via GitHub Pages)

## Architecture

This is a **static site with zero build steps**. All pages are plain HTML/CSS/JS served directly by GitHub Pages. There is no framework, no bundler, no npm, and no backend.

### Two-application model

1. **Public portal** — Root-level HTML pages (index.html, history.html, farm-programs.html, etc.) with informational content about Pioneer seeds, farm programs, and the McConnell family.
2. **Protected crop planner** — The `/crop-planner/` subdirectory is a self-contained planning tool for M77 AG operations. It requires member login and provides cost breakdowns, input details, and revenue projections.

### Data flow

All data lives in JavaScript constant files (`data/crops.js`, `data/costs.js`). Pages load these scripts, then `js/main.js` reads the constants to calculate and render tables, cards, and summaries. There are no API calls or database — everything is client-side.

```
HTML page → loads data/*.js (constants) → js/main.js processes & renders → DOM
```

### Authentication

Simple localStorage-based session. A single shared password (`mcconnell`) sets `localStorage.memberAuth = 'true'`. Protected pages include `js/auth.js` which redirects unauthenticated visitors to `members.html`.

## Directory Structure

```
/
├── CNAME                       # DNS: youraginfo.com
├── .nojekyll                   # Disables Jekyll on GitHub Pages
├── README.md                   # Crop plan documentation
│
├── index.html                  # Public landing page with login
├── members.html                # Member dashboard (login gate)
├── seedbook.html               # Pioneer multi-year seed performance data
├── yield-zone.html             # Yield zone analysis tool
├── farm-programs.html          # FSA programs, insurance deadlines
├── history.html                # McConnell family legacy
├── login-gov-guide.html        # Login.gov step-by-step guide
├── ncga.html                   # National Corn Growers info
├── soybeans.html               # Soybean production info
├── sorghum.html                # Grain sorghum info
│
├── css/
│   └── style.css               # Main site styles (~3860 lines)
│                                 Dark green/gold theme, serif headings,
│                                 responsive layout, CSS variables
│
├── js/
│   ├── main.js                 # Core logic: page detection, rendering,
│   │                             login handling, cost calculations
│   └── auth.js                 # Session check (10 lines, redirects if
│                                 not authenticated)
│
├── data/
│   ├── crops.js                # Root crop data (corn only, 960 acres)
│   └── costs.js                # Root cost database (operations, fert,
│                                 chemicals, irrigation, overhead)
│
├── images/                     # Logos, photos, login.gov screenshots
│                                 (~14 MB, checked into git)
│
├── pages/                      # Shared pages used by crop planner
│   ├── costs.html
│   ├── inputs.html
│   ├── projections.html
│   └── offer.html              # Rate sources & methodology
│
└── crop-planner/               # Self-contained crop planning sub-app
    ├── index.html              # Dashboard: total acres, costs, breakeven
    ├── css/
    │   └── style.css           # Dark theme (IBM Plex fonts, ~393 lines)
    ├── js/
    │   └── main.js             # Extended logic for 6 crop types
    ├── data/
    │   ├── crops.js            # 6 crops, 3640 total acres
    │   └── costs.js            # Comprehensive per-crop cost database
    └── pages/
        ├── costs.html          # Cost breakdown by category
        ├── inputs.html         # Fertilizer, chemical, operation details
        └── projections.html    # Revenue projections & breakeven
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5, static pages |
| Styling | CSS3 with custom properties, responsive design |
| Logic | Vanilla JavaScript (ES6+), no frameworks |
| Fonts | Google Fonts (Playfair Display, Source Serif 4, Inter; IBM Plex for crop planner) |
| Hosting | GitHub Pages |
| Data | JavaScript constant objects in `.js` files |
| Auth | localStorage session, single password |
| Build | None — no npm, no bundler, no transpilation |

## Key Conventions

### Data files

- All agricultural data is stored as JavaScript constants (e.g., `const CROPS = [...]`, `const COSTS = {...}`)
- Data files are in `data/` directories and export constants via global scope (no ES modules)
- Two parallel data sets exist: root `data/` (corn-only, simpler) and `crop-planner/data/` (6 crops, comprehensive)

### Cost methodology — "75% of spread"

Custom operation rates use: `Rate = Low + 0.75 × (High - Low)`. This picks the 75th percentile of reported survey ranges. Primary source is Iowa State 2025 Farm Custom Rate Survey; secondary is CSU Extension 2024.

### Styling

- **Main site:** Professional green/gold palette — primary `#1a472a`, accent `#c9a227`. Serif headings, sans-serif body. Container max 1200px.
- **Crop planner:** Dark mode — background `#0d1117`, accent blue `#58a6ff`. Monospace data display with IBM Plex fonts.

### Page rendering pattern

`js/main.js` detects which page is loaded and calls the appropriate update function (`updateDashboard()`, `updateCostsPage()`, `updateInputsPage()`, `updateProjectionsPage()`). Each function reads the global data constants, performs calculations, and writes directly to the DOM.

### Protected pages

Any page that needs authentication includes `<script src="../js/auth.js"></script>` (or the appropriate relative path). This script runs immediately and redirects if `localStorage.memberAuth` is not `'true'`.

## Development Workflow

### Making changes

1. Edit HTML, CSS, JS, or data files directly — no build step required
2. Open HTML files in a browser to preview (or use a local server)
3. Commit and push to `master` for deployment

### Updating crop data

- Edit `data/crops.js` to change acreage, yields, or price targets
- Edit `data/costs.js` to change operation rates, fertilizer prices, chemical programs, or overhead
- The crop planner has its own parallel data files in `crop-planner/data/`
- Changes propagate automatically through the JavaScript rendering pipeline

### Adding a new page

1. Create an HTML file at the root level (for public) or under `crop-planner/pages/` (for protected)
2. Include the appropriate CSS (`css/style.css` or `crop-planner/css/style.css`)
3. Include data files if needed (`data/crops.js`, `data/costs.js`)
4. Include `js/main.js` for rendering logic
5. Include `js/auth.js` if the page should be protected
6. Add navigation links from `members.html` or the crop planner dashboard

### Deployment

Push to `master` — GitHub Pages serves the site automatically at youraginfo.com. No CI/CD pipeline, no build artifacts.

## Important Notes

- **No package.json** — Do not add npm dependencies. This project intentionally avoids build tooling.
- **No ES modules** — Scripts use global scope constants. Do not convert to `import`/`export`.
- **Large images** — The `images/` directory contains ~14 MB of assets (logo animations, photos). Avoid adding more large files.
- **Two data layers** — Root `data/` and `crop-planner/data/` are independent. When updating crop/cost information, check whether both need updating.
- **Hardcoded password** — Authentication uses a single plaintext password in `members.html`. This is intentional for the current use case (member convenience, not security-critical data).
- **No tests** — There is no test suite. Verify changes by opening pages in a browser.
- **Commit style** — Use short, imperative commit messages that describe what changed (see git log for examples: "Fix crop planner nav to link back to Member Dashboard", "Add mobile viewing tip to data-heavy pages").
