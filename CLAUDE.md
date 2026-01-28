# CLAUDE.md - AI Assistant Guide for EV Phase-In Rate Estimator

## Project Overview

This is the **EV Phase-In Rate Estimator** - a React/TypeScript web application for ChargeSmart EV (CSEV) that helps commercial customers estimate costs for EV charging under National Grid's Phase-In Rate (EV PIR) program. It compares EV PIR costs against standard demand rates to show potential savings.

**Key Business Context:**
- ChargeSmart EV sells and manages EV charging equipment
- National Grid offers a special rate program (EV PIR) with tiered demand charge discounts based on load factor
- This tool helps customers understand their potential electricity costs and revenue from charging

## Quick Reference

```bash
npm install          # Install dependencies
npm run dev          # Start dev server on port 3000
npm run build        # Build for production (tsc && vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

**Deployment:** Netlify (configured in `netlify.toml`)

## Architecture

```
src/
├── App.tsx                 # Main application component
├── main.tsx                # React entry point
├── index.css               # Global styles with Tailwind
├── components/
│   ├── inputs/             # User input components
│   │   ├── BillingPeriodInputs.tsx   # Usage hours/TOU period inputs
│   │   ├── EVSEInstalled.tsx         # Charger inventory management
│   │   ├── MeteringSelector.tsx      # Separate vs combined metering
│   │   ├── ProjectInfo.tsx           # Customer/project name
│   │   ├── RevenueSettings.tsx       # Driver pricing/revenue share
│   │   ├── ServiceClassSelector.tsx  # National Grid service class
│   │   └── UtilitySelector.tsx       # Utility selection
│   ├── results/            # Calculation result displays
│   │   ├── CostHighlight.tsx         # Key cost metrics
│   │   ├── ResultsSummary.tsx        # Summary with tier info
│   │   ├── RevenueResults.tsx        # Revenue from charging drivers
│   │   ├── SeasonBreakdown.tsx       # Summer vs winter costs
│   │   └── YearlyTotal.tsx           # Annual summary
│   ├── report/             # PDF report generation
│   │   ├── DownloadButton.tsx        # PDF download trigger
│   │   └── PDFReport.tsx             # @react-pdf/renderer document
│   ├── layout/             # Header, Footer
│   └── ProjectsModal.tsx   # Project management modal
├── data/
│   ├── chargers.ts         # EVSE equipment catalog (from CSEV_Station_List_v1.0.xlsx)
│   ├── serviceClasses.ts   # Service class definitions
│   └── rates/
│       └── nationalGrid.ts # EV PIR rate tables by tier/service class
├── hooks/
│   ├── useCalculations.ts  # Triggers calculation on project change
│   └── useProjectStorage.ts # localStorage project CRUD
├── types/
│   └── index.ts            # All TypeScript interfaces and types
└── utils/
    ├── calculations.ts     # Core calculation logic
    ├── tierCalculation.ts  # Load factor and tier determination
    └── formatters.ts       # Currency, kWh, percentage formatting
```

## Domain Knowledge

### EV Phase-In Rate (EV PIR) Tiers

Load factor determines the rate tier. Lower load factor = better (more) discounts.

| Tier | Load Factor | Description |
|------|-------------|-------------|
| Tier 1 | ≤10% | Maximum discount ($0 demand charge) |
| Tier 2 | >10% to ≤15% | High discount |
| Tier 3 | >15% to ≤20% | Moderate discount |
| Tier 4 | >20% to ≤25% | Minimum discount |
| Standard (Tier 0) | >25% | No discount, standard demand rate |

**Load Factor Calculation:**
```
Load Factor = Annual kWh / (Nameplate kW × 8,760 hours)
```

### Seasons
- **Summer:** June - September (4 months)
- **Winter:** October - May (8 months)

### Time-of-Use Periods

**Summer:**
- Super-Peak: 2pm - 6pm weekdays (highest rate)
- On-Peak: 6am - 2pm, 6pm - 10pm weekdays
- Off-Peak: All other hours (nights, weekends, holidays)

**Winter:**
- On-Peak: 6am - 10pm weekdays
- Off-Peak: All other hours

### Service Classes

| Service Class | Description |
|---------------|-------------|
| SC-2D | Commercial service with demand metering (most common) |
| SC-3 Secondary | Large commercial - Secondary voltage |
| SC-3 Primary | Large commercial - Primary voltage |
| SC-3 SubT/Trans | Large commercial - Subtransmission/Transmission |
| SC-3A Sec/Pri | Large commercial with TOU - Secondary/Primary |
| SC-3A SubT | Large commercial with TOU - Subtransmission |
| SC-3A Trans | Large commercial with TOU - Transmission |

### Charger Types

- **Level 2:** AC charging (208V or 240V), typical 7-19 kW
- **DCFC (Level 3):** DC fast charging (480V), 60-320 kW

## Key Types (src/types/index.ts)

```typescript
// Core project structure
interface Project {
  id: string;
  name: string;
  customerName: string;
  projectAddress: string;
  utility: 'national-grid' | string;
  serviceClass: ServiceClass;  // 'SC-2D', 'SC-3 Secondary', etc.
  meteringType: MeteringType;  // 'separate' | 'combined'
  chargers: ChargerEntry[];
  billingInputs: BillingInputs;
  supplyRatePerKwh?: number;
  revenueSettings?: RevenueSettings;
}

// Charger in inventory
interface ChargerEntry {
  id: string;
  evseId: string;              // Reference to equipment catalog
  kwPerCharger: number;        // Based on selected voltage
  quantity: number;
  numberOfPlugs: number;
  individualCircuits: boolean; // If true, multiply kW by plugs
}

// Usage inputs
interface BillingInputs {
  daysInMonth: number;
  avgDailyPortsUsed: number;
  avgHoursPerPortPerDay: number;
  peakPortsUsed: number;
  summer: { onPeakHours, offPeakHours, superPeakHours };
  winter: { onPeakHours, offPeakHours };
}
```

## Calculation Flow

1. **User configures project:** Service class, chargers, usage inputs
2. **calculateResults()** in `src/utils/calculations.ts`:
   - Calculate nameplate kW from charger inventory
   - Calculate estimated annual kWh from usage inputs
   - Determine load factor and tier
   - Get rates for tier and service class
   - Calculate monthly costs for summer/winter
   - Calculate annual summary and savings vs standard rate
   - Calculate revenue from charging drivers

## Coding Conventions

### TypeScript
- Strict TypeScript with explicit types
- All interfaces defined in `src/types/index.ts`
- Use type imports: `import type { Project } from '../types'`

### React Patterns
- Functional components with hooks
- Props destructuring: `function Component({ project, onUpdate }: Props)`
- useCallback for event handlers passed to children
- useState + useEffect for local state
- Custom hooks in `src/hooks/` for reusable logic

### Styling
- Tailwind CSS with custom brand colors defined in `tailwind.config.js`
- Primary color: Teal (#00af9b)
- Secondary color: Blue (#1991e1)
- Accent color: Gold (#ffb900)
- Use utility classes, not inline styles
- Consistent spacing: `space-y-4`, `space-y-6`, `gap-4`
- Card pattern: `className="card"` (defined in index.css)

### Formatting
- Currency: `formatCurrency(value)` from `src/utils/formatters.ts`
- kWh: `formatKwh(value)`
- Percentages: `formatPercent(value)`
- Rates: `formatRate(value, 'kWh')` or `formatRate(value, 'kW')`

### Data Flow
- Projects stored in localStorage via `useProjectStorage` hook
- Single source of truth: `currentProject` state
- Updates flow down via props, changes flow up via `onUpdate` callbacks
- Calculations derived from project state via `useCalculations` hook

## Important Files

| File | Purpose |
|------|---------|
| `src/utils/calculations.ts` | Core calculation engine - all cost calculations |
| `src/utils/tierCalculation.ts` | Load factor and tier determination logic |
| `src/data/rates/nationalGrid.ts` | Rate tables by tier and service class |
| `src/data/chargers.ts` | EVSE equipment catalog |
| `src/types/index.ts` | All TypeScript type definitions |
| `src/hooks/useProjectStorage.ts` | localStorage project management |
| `src/components/report/PDFReport.tsx` | PDF generation with @react-pdf/renderer |

## Common Tasks

### Adding a New Service Class
1. Add to `ServiceClass` type in `src/types/index.ts`
2. Add rate data to `src/data/rates/nationalGrid.ts`
3. Add to dropdown in `src/data/serviceClasses.ts`

### Adding a New Charger Model
1. Add entry to `evseEquipment` array in `src/data/chargers.ts`
2. Include: id, level, name, manufacturer, numberOfPlugs, kW at each voltage

### Modifying Rate Calculations
- Main logic: `calculateResults()` in `src/utils/calculations.ts`
- Tier logic: `determineTier()` in `src/utils/tierCalculation.ts`
- Rate data: `src/data/rates/nationalGrid.ts`

### PDF Report Changes
- All PDF styling uses @react-pdf/renderer's `StyleSheet.create()`
- Component: `src/components/report/PDFReport.tsx`
- Uses inline styles, not Tailwind (different rendering engine)

## Testing Notes

- No test framework currently configured
- Manual testing recommended after calculation changes
- Key scenarios to verify:
  - Tier 1-4 and Standard rate assignment
  - Summer vs winter cost differences
  - Revenue calculations with different settings
  - PDF report generation

## Data Sources

Reference files in repository root:
- `EV_PIR_Estimator v1.0.0.xlsx` - Original Excel calculator (reference for rates)
- `CSEV_Station_List_v1.0.xlsx` - Charger equipment catalog source
- `Grid EV Phase-In Rate Guide - 7-30-25.pdf` - Rate program documentation
- `OG File Reference - *.png` - Screenshots of original Excel file

## Known Constraints

1. **Utility:** Currently only supports National Grid (extensible via `getRateTable()`)
2. **Storage:** localStorage only, no backend/database
3. **Browser Support:** Modern browsers with ES6+ support
4. **PDF:** Generated client-side, may be slow for large reports

## Backwards Compatibility

Legacy service class names are auto-migrated:
- `SC-1`, `SC-2`, `SC-2-MRP` → `SC-2D`
- `SC-3` → `SC-3 Secondary`

Migration handled in `useProjectStorage.ts` and `calculations.ts`.
