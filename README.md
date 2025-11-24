Calculates the optimal menu combination to drain your loyalty card balance to exactly zero by determining the minimum top-ups required.

# Loyalty Card Balance Drainer

Uses a dynamic programming algorithm (unbounded knapsack variation) to find the cheapest combination of menu items that exactly equals your current balance plus the minimum number of top-ups.

## Features

- Custom menu items or **Starbucks Singapore preset** (78 items)
- Optimizes for minimum top-ups required
- LocalStorage persistence for balance, increment, and menu
- Fully responsive design.
- Client-side 100%.

## If Run Locally

**Prerequisites:** Node.js 22+

1. `npm install`
2. `npm run dev`

## Tech Stack

- **Svelte 5** - Component framework with runes
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (CDN)
- **lucide-svelte** - Icons

**Preset Data Source:** <https://sgmenus.net/starbucks-menu-singapore/>
