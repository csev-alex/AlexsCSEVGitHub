# EV Phase-In Rate Estimator

A web-based tool for ChargeSmart EV to help commercial customers estimate costs for EV charging under National Grid's Phase-In Rate program, comparing it to standard demand rates.

## Features

- **Rate Calculation**: Calculate costs under National Grid's EV Phase-In Rate tiers
- **Load Factor Analysis**: Automatic tier determination based on historical usage
- **Seasonal Breakdown**: Separate summer and winter cost calculations
- **PDF Reports**: Generate downloadable PDF reports for customers
- **Project Management**: Save and manage multiple projects locally

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Create a Project**: Click "New Project" to start a new cost estimate
2. **Configure Settings**: Select utility, service class, and metering type
3. **Add Chargers**: Add your EV chargers to the inventory
4. **Enter Historical Usage**: Input 12-month kWh data for tier calculation
5. **Set Billing Inputs**: Configure typical monthly usage patterns
6. **View Results**: See calculated costs, savings, and comparisons
7. **Download Report**: Generate a PDF report to share with customers

## Rate Structure

The EV Phase-In Rate provides tiered demand charge discounts based on load factor:

| Tier | Load Factor | Discount |
|------|-------------|----------|
| 1 | ≤10% | Maximum |
| 2 | 10-15% | High |
| 3 | 15-20% | Moderate |
| 4 | 20-25% | Minimum |
| Standard | >25% | None |

## Technology Stack

- React 18 + TypeScript
- Tailwind CSS
- Vite
- @react-pdf/renderer for PDF generation

## Deployment

This project is configured for deployment on Netlify. Simply connect your repository to Netlify for automatic deployments.

## License

Proprietary - ChargeSmart EV
