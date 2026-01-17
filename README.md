# 🎮 Game Zone Monad

A premium Web3 gaming platform built on the Monad blockchain, inspired by MPL, Dream11, and Winzo. Features skill-based games, real-time tournaments, NFT rewards, and a referral system.

## 🚀 Features

### Core Gaming
- **4 Skill-Based Games**
  - 🥤 **Cups Game**: Test your luck with shell game mechanics (up to 50x multiplier)
  - ⚡ **Reaction Game**: Lightning-fast reflexes (up to 5x multiplier)
  - 🧠 **Memory Game**: Remember sequences (up to 11x multiplier)
  - 🚀 **Crash Game**: Cash out before the rocket crashes (unlimited multiplier)

### Web3 Integration
- **Multi-Wallet Support**: MetaMask, WalletConnect etc
- **Monad Blockchain**: Built for high-performance gaming on Monad
- **RainbowKit**: Beautiful wallet connection UI
- **Real-time Balance**: Live MON token balance update

### Tournament System
- **Live Tournaments**: Compete in real-time skill-based competitions
- **Entry Fees & Prize Pools**: Win MON tokens
- **Live Leaderboards**: Track rankings in real-time
- **Sponsored Tournaments**: Brand partnerships with premium rewards

### NFT Rewards & Social Features
- **Achievement NFTs**: Unlock on-chain collectibles
- **Referral System**: Earn 10% of friends' winnings forever
- **50+ Analytics Events**: Comprehensive user behavior tracking

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Blockchain**: Monad (EVM-compatible)
- **Web3 Libraries**: wagmi v3, viem, RainbowKit, ethers
- **UI Framework**: TailwindCSS + shadcn/ui
- **Animations**: Framer Motion

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 🔧 Quick Setup

1. **Update Monad RPC**: Edit `src/config/chains.ts` with actual Monad RPC endpoints
2. **Configure WalletConnect**: Get project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
3. **Deploy Contracts**: Update addresses in `src/config/contracts.ts`

## 📱 Pages

- `/` - Landing page with game showcase
- `/play` - Main gaming interface
- `/tournaments` - Live tournaments & leaderboards
- `/rewards` - NFT achievements & referrals

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
