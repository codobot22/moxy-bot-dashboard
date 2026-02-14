# Moxy Bot - Book Arbitrage Dashboard

Production-grade Vinted book arbitrage monitoring system with mobile-first UI.

## Business Logic

Based on legacy `moxy.py` arbitrage formula:
```
Profit = Momox Price - (Vinted Price + Protection Fee + Shipping)

Protection Fee = Vinted Price × 0.05 + €0.70
```

## Features

- 📱 **Mobile-first design** - Optimized for phone usage
- 📚 **Book-focused** - Filters Vinted for books (ISBN tracking)
- 💰 **Profit calculation** - Real-time Momox price comparison
- 🔄 **Auto-refresh** - Updates every 30 seconds
- 🎨 **Clean UI** - Built with Radix UI + Tailwind CSS

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── deals/route.ts    # Get all deals
│   │   ├── stats/route.ts    # Dashboard statistics
│   │   └── momox/route.ts    # Momox price lookup
│   ├── page.tsx              # Main dashboard
│   └── layout.tsx
├── components/
│   ├── DealCard.tsx          # Deal display card
│   └── ui/                   # Radix UI components
└── lib/
    ├── types.ts              # TypeScript definitions
    ├── utils.ts              # Utility functions
    ├── deals.ts              # Deal data management
    └── constants.ts          # API endpoints
```

## Setup

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

## Deployment

Deploy to Vercel:

```bash
npx vercel --prod
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MOMOX_API_KEY` | Momox API token for price lookups |

## Legacy Code

The original arbitrage logic is in `moxy.py`:
- Extracts ISBN from Vinted items
- Queries Momox API for buyback prices
- Calculates profit and notifies Discord

## License

MIT
