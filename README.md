# Dream7 — IPL Prediction Wall on Monad

> Bet YES or NO on live cricket moments. Instant. On-chain. Cheap.

Dream7 is a binary prediction market dApp built on **Monad Testnet**. Users place bets on IPL cricket events, crypto price movements, and memes — all settled on-chain with sub-second finality.

**Live Demo:** [https://monad-blitz-delhi-dream7.vercel.app](https://monad-blitz-delhi-dream7.vercel.app)

---

## Features

- **Binary YES/NO Markets** — Simple prediction markets with real-time odds
- **On-Chain Settlement** — Bets, resolutions, and payouts on Monad Testnet
- **One Bet Per User** — Each user can only place one bet per market
- **Admin Early Resolution** — Admin can resolve markets before the deadline
- **Proportional Payouts** — Winners receive their share of the total pool
- **Real-Time Odds** — Live odds with bar and donut charts
- **Audio Feedback** — IPL theme on first visit, sound effects on actions
- **Wallet Integration** — MetaMask via Privy for seamless UX
- **Responsive UI** — Cricket-themed dark mode with stadium background and animations

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Blockchain | Monad Testnet (Chain ID: 10143) |
| Smart Contract | Solidity 0.8.24 |
| Wallet | Privy + wagmi v3 + viem |
| Charts | Recharts |
| Deployment | Vercel |

---

## Smart Contract

- **Address:** `0x46C67e8ba1B9b13Cb62E52c8BFCFc93C96431321`
- **Chain:** Monad Testnet (RPC: `https://testnet-rpc.monad.xyz`)
- **Source:** [`src/hooks/dream7.sol`](src/hooks/dream7.sol)

### Key Functions

| Function | Access | Description |
|---|---|---|
| `createMarket()` | Admin | Create a new YES/NO market |
| `resolveMarket()` | Admin | Resolve a market (can be done before deadline) |
| `betYes()` / `betNo()` | Public | Place a bet (one per user per market) |
| `claim()` | Public | Winners withdraw proportional payout |
| `setAdmin()` | Admin | Transfer admin role |

---

## Admin Panel

Navigate to `/admin` and enter the password to access the admin dashboard.

**Admin Password:** `thala`

From the admin panel you can:
- Create new prediction markets
- Resolve markets (YES/NO outcome)
- Run Chaos Mode (bulk test bets)

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MetaMask wallet with Monad Testnet configured

### Monad Testnet Network Config

| Field | Value |
|---|---|
| Network Name | Monad Testnet |
| RPC URL | `https://testnet-rpc.monad.xyz` |
| Chain ID | `10143` |
| Currency | MON |
| Explorer | `https://testnet.monadvision.com` |

### Install & Run

```bash
# Clone the repo
git clone https://github.com/arpit2222/monad-blitz-delhi-dream7.git
cd monad-blitz-delhi-dream7

# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local
# Add your NEXT_PUBLIC_PRIVY_APP_ID

# Run dev server
pnpm dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID for wallet auth |
| `NEXT_PUBLIC_SITE_URL` | Site URL for metadata |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home — market listing + splash screen
│   ├── market/[id]/page.tsx  # Market detail — bet, odds, claim
│   └── admin/page.tsx        # Admin panel — create & resolve markets
├── components/
│   ├── admin/                # AdminCreateMarketForm, AdminResolveList, ChaosMode
│   ├── market/               # BetForm, MarketCard, charts
│   ├── layout/               # Navbar, AppShell, StadiumBackground
│   └── ui/                   # Toast, CricketBall
├── lib/
│   ├── contract.ts           # ABI + contract address
│   ├── dream7utils.ts        # Payout estimation
│   └── sounds.ts             # Audio feedback utility
├── config/chains.ts          # Monad Testnet chain config
├── providers/Providers.tsx   # Privy + wagmi + React Query
└── hooks/dream7.sol          # Smart contract source
```

---

## How It Works

1. **User connects wallet** via Privy (MetaMask)
2. **Browse markets** on the home page — filter by category
3. **Place a bet** — choose YES or NO, pick an amount (one bet per market)
4. **Admin resolves** — sets the outcome when the event concludes
5. **Winners claim** — proportional payout from the total pool

---

## Built for Monad Blitz Delhi Hackathon
