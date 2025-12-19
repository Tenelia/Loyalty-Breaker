# Loyalty Card Balance Drainer

Calculates the optimal combination of menu items to drain your loyalty card balance to exactly zero by minimizing the number of forced top-ups.

Uses a dynamic programming algorithm (unbounded knapsack variation) to find the cheapest combination of menu items that exactly equals your current balance plus the minimum number of top-ups.

## Features

- Custom menu items or **Starbucks Singapore preset** (78 items)
- Always returns at least three diverse solutions
- LocalStorage persistence for balance, increment, and menu
- Fully responsive, touch-friendly UI
- Client-side only - zero backend
- Lightweight bundle (~5.5 KB gzipped CSS + 19.2 KB gzipped JS)

## Development

**Prerequisites:** Node.js 22+

1. `npm install`
2. `npm run dev`

## Production Build

1. `npm run build` - Builds the production bundle
2. `npm run preview` - Preview the production build locally
3. `npm run typecheck` - Run TypeScript type checking
4. `npm run lint` - Run linting checks

## Tech Stack

- **Svelte 5** - Component framework with runes
- **Vite** - Build tool and dev server (52 KB bundle, 19.2 KB gzipped)
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling (bundled via npm, no CDN dependency)
