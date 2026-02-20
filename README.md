<p align="center">
  <img src="public/zero3.png" alt="Protocol Zero Logo" width="120" />
</p>

<h1 align="center">Protocol Zero</h1>

<p align="center">
  <strong>AI-Powered Code Police — Automated Code Review, Self-Healing Bugs & Blockchain Attestation</strong>
</p>

<p align="center">
  <a href="https://protocol-zero-tnbi.onrender.com/">Live Demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#architecture">Architecture</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?logo=google" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity" alt="Solidity" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase" alt="Firebase" />
</p>

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
  - [Code Police](#-code-police)
  - [Self-Healing Code](#-self-healing-code)
  - [Blockchain Notary](#-blockchain-notary)
  - [Dashboard & Admin](#-dashboard--admin)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Smart Contract Deployment](#smart-contract-deployment)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributors](#contributors)

---

## Introduction

**Protocol Zero** is a full-stack AI-powered DevOps platform that acts as an autonomous code quality guardian for your GitHub repositories. It combines real-time AI code review, autonomous bug detection & fixing, and immutable blockchain audit trails — all in a single, unified dashboard.

Connect any GitHub repository, and Protocol Zero will:
1. **Review every push & pull request** with multi-dimensional AI analysis (security, performance, bugs, readability, test coverage).
2. **Autonomously heal broken code** — clone, scan, fix, test, and submit Pull Requests, all without human intervention.
3. **Record every AI fix on-chain** via a Solidity smart contract on Ethereum Sepolia, creating a tamper-proof compliance log.

> *"Enough Building, time for redemption."*

---

## Features

### 🚔 Code Police

Webhook-driven AI code review that watches every commit in real-time.

- **Automated Analysis** — Triggered on every `push` and `pull_request` event via GitHub webhooks
- **Multi-Dimensional Review** — Each file is analyzed for security vulnerabilities, performance issues, bugs, readability, and test coverage
- **Auto-Fix Pull Requests** — Critical and high-severity issues trigger automatic fix PRs with AI-generated patches
- **Email Reports** — Rich HTML email digests summarizing findings and linking directly to auto-fix PRs
- **Custom Rules** — Define your own rules (e.g., *"No console.log in production"*, *"Enforce async/await over .then()"*)
- **Full Repository Scan** — On-demand full-repo analysis with parallel processing (5 files concurrently) and multi-layer caching (in-memory + Redis)
- **Repository Health Analytics** — Health scores, language breakdown, commit activity, contributor stats, PR metrics, documentation presence, and AI-powered executive summaries

### 🩺 Self-Healing Code

A multi-agent autonomous pipeline that clones your repo, finds bugs, writes fixes, runs tests, and opens a PR.

- **Multi-Agent Architecture** — 5 specialized agents working in concert:
  | Agent | Role |
  |-------|------|
  | **Orchestrator** | Coordinates the entire healing loop with up to 3 retry attempts |
  | **Bug Scanner (The Scout)** | AI-powered scanning for SYNTAX, LINTING, RUNTIME, LOGIC, IMPORT, TYPE, and DEPENDENCY bugs |
  | **Fix Engineer** | Generates complete fixed file contents using Gemini AI |
  | **Test Runner** | Auto-detects framework (Jest, Vitest, Mocha, pytest, Go, Cargo, etc.) and runs tests |
  | **Repo Manager** | Git operations — fork, clone, branch, commit, push, create PR |

- **Live Streaming via SSE** — Watch the healing process in real-time with a live timeline, bug table, file tree, and score breakdown
- **Automatic PR Creation** — Creates a PR with branch name `TEAM_LEADER_AI_Fix` and `[AI-AGENT]` commit prefix
- **Score Breakdown** — Weighted 0–100 score with per-category analytics and animated visualizations
- **5-Minute Timeout** — Safety guard to prevent runaway sessions

### ⛓️ Blockchain Notary

Immutable, tamper-evident audit trail for every AI code fix.

- **On-Chain Attestations** — Every fix is recorded as a Solidity `Attestation` struct containing: session ID, bug category, file path, line number, error message, fix description, test results (before & after), commit SHA, and timestamp
- **ComplianceLog Smart Contract** — Deployed on Ethereum Sepolia testnet (`Solidity 0.8.24`)
- **Etherscan Verification** — Every attestation links directly to its transaction on Etherscan for independent verification
- **Read-Only Public Auditing** — Anyone can query the contract to audit the AI agent's fix history
- **Graceful Degradation** — Blockchain features are optional; the platform works fully without blockchain configuration

### 📊 Dashboard & Admin

A comprehensive, feature-rich dashboard with a premium dark UI.

- **Home Dashboard** — Greeting, stats cards, code review counts, recent activity feed
- **Code Police Panel** — Connect repos, view analysis results, manage project settings, explore issues, trigger full scans
- **Self-Healing Panel** — Submit healing requests, view session history, live session streaming with timeline & attestation log
- **Notifications Center** — In-app notifications for code analysis completions, critical issues, auto-fix PRs, and repo connections
- **Settings** — Analytics overview, project management, activity history, integrated Clerk profile
- **Admin Panel** — Email-gated admin dashboard with total user/project/analysis stats, user management, and activity logs
- **SaaS Usage Tracking** — Free and Pro tier limits with monthly resets

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) · React 19 · TypeScript 5.9 |
| **AI** | Google Gemini (2.5 Flash Lite, 2.0 Flash) via LangChain |
| **Authentication** | Clerk (OAuth · GitHub Social Connection) |
| **Database** | Firebase / Firestore (primary) · Redis (L2 cache) |
| **Blockchain** | Solidity 0.8.24 · Hardhat · ethers.js v6 · Sepolia Testnet |
| **GitHub Integration** | Octokit · Webhooks · Bot Token (PAT) |
| **Email** | Nodemailer (SMTP) · Resend |
| **UI Components** | Radix UI · Framer Motion · Tailwind CSS v4 · Recharts |
| **3D / Animations** | Spline 3D · cobe (globe) · tsparticles · canvas-confetti |
| **Forms & Validation** | React Hook Form · Zod v4 |
| **State Management** | Zustand · TanStack React Query · SWR |
| **Deployment** | Vercel · Netlify · Render |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PROTOCOL ZERO                            │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│   Landing    │  Dashboard   │  Admin       │  API Layer         │
│   Page       │  (Protected) │  (Gated)     │  31 Endpoints      │
├──────────────┴──────────────┴──────────────┴────────────────────┤
│                         MIDDLEWARE                               │
│              Clerk Auth · Route Protection                       │
├─────────────────────────────────────────────────────────────────┤
│                       AI AGENTS                                  │
│  ┌─────────────────────┐   ┌──────────────────────────────┐    │
│  │    CODE POLICE       │   │     SELF-HEALING ENGINE      │    │
│  │  ┌───────────────┐  │   │  ┌────────────────────────┐  │    │
│  │  │ Analyzer      │  │   │  │ Orchestrator           │  │    │
│  │  │ Fix Generator │  │   │  │ Bug Scanner (Scout)    │  │    │
│  │  │ PR Creator    │  │   │  │ Fix Engineer           │  │    │
│  │  │ Email Service │  │   │  │ Test Runner            │  │    │
│  │  │ Analytics     │  │   │  │ Repo Manager           │  │    │
│  │  │ Cache Layer   │  │   │  │ Progress Emitter (SSE) │  │    │
│  │  └───────────────┘  │   │  └────────────────────────┘  │    │
│  └─────────────────────┘   └──────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                     DATA & SERVICES                              │
│  ┌────────────┐ ┌────────┐ ┌────────────┐ ┌─────────────────┐  │
│  │ Firestore  │ │ Redis  │ │ GitHub API │ │ Sepolia (EVM)   │  │
│  │ (Primary)  │ │ (Cache)│ │ (Webhooks) │ │ ComplianceLog   │  │
│  └────────────┘ └────────┘ └────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **yarn** or **pnpm**
- **Git**
- A **Google Cloud** account with [Gemini API](https://ai.google.dev/) access
- A **Clerk** account ([clerk.com](https://clerk.com))
- A **Firebase** project with Firestore enabled
- *(Optional)* A **GitHub Personal Access Token** with `repo` scope for the self-healing bot
- *(Optional)* An **Alchemy** or **Infura** account for Sepolia RPC access

### Installation

```bash
# Clone the repository
git clone https://github.com/zaidkhan-sudo/protocol_zero.git
cd protocol_zero

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# ═══════════════════════════════════════════════════
# REQUIRED
# ═══════════════════════════════════════════════════

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ═══════════════════════════════════════════════════
# FIREBASE (Required for full functionality)
# ═══════════════════════════════════════════════════

# Server-side (Firebase Admin) — choose ONE method:
# Method 1: Individual keys
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Method 2: Service account JSON file path
# FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/service-account.json

# Method 3: Base64-encoded service account JSON
# FIREBASE_ADMIN_SERVICE_ACCOUNT=base64_encoded_json

# Client-side (Firebase SDK)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# ═══════════════════════════════════════════════════
# GITHUB
# ═══════════════════════════════════════════════════

GITHUB_BOT_TOKEN=ghp_...              # PAT with repo scope (self-healing bot)
GITHUB_CLIENT_ID=your_github_oauth_id  # GitHub OAuth app

# ═══════════════════════════════════════════════════
# BLOCKCHAIN (Optional — Sepolia Testnet)
# ═══════════════════════════════════════════════════

SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/...
DEPLOYER_PRIVATE_KEY=0x...
COMPLIANCE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/...

# ═══════════════════════════════════════════════════
# EMAIL (Optional — SMTP via Nodemailer)
# ═══════════════════════════════════════════════════

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# ═══════════════════════════════════════════════════
# OTHER
# ═══════════════════════════════════════════════════

CLERK_WEBHOOK_SECRET=whsec_...        # Svix webhook verification
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com        # Comma-separated admin emails
REDIS_URL=redis://localhost:6379      # Optional L2 cache
```

### Running Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

**Other scripts:**

```bash
npm run build          # Production build (with env validation)
npm run start          # Start production server
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix lint errors
npm run type-check     # TypeScript type checking
```

### Smart Contract Deployment

To deploy the `ComplianceLog` contract to Sepolia:

```bash
# Ensure SEPOLIA_RPC_URL and DEPLOYER_PRIVATE_KEY are set in .env
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

After deployment, update `COMPLIANCE_CONTRACT_ADDRESS` in your environment with the deployed contract address.

---

## Project Structure

```
protocol_zero/
├── contracts/                  # Solidity smart contracts
│   └── ComplianceLog.sol       # On-chain audit trail contract
├── scripts/
│   ├── deploy.ts               # Hardhat deployment script
│   └── validate-env.js         # Pre-build env validation
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout (Clerk + fonts)
│   │   ├── providers.tsx       # Client providers (React Query)
│   │   ├── api/                # 31 API route handlers
│   │   │   ├── auth/           # GitHub OAuth status
│   │   │   ├── code-police/    # Analysis, issues, analytics, auto-fix
│   │   │   ├── self-healing/   # Start session, SSE stream, attestations
│   │   │   ├── webhooks/       # GitHub & Clerk webhooks
│   │   │   ├── dashboard/      # Dashboard stats
│   │   │   ├── admin/          # Admin endpoints (gated)
│   │   │   ├── github/         # Repo listing & connection
│   │   │   ├── notifications/  # Mark read, delete
│   │   │   ├── projects/       # Unified CRUD
│   │   │   ├── user/           # Init & usage tracking
│   │   │   └── health/         # Health check
│   │   ├── dashboard/          # Protected dashboard pages
│   │   │   ├── code-police/    # Code Police UI
│   │   │   ├── self-healing/   # Self-Healing UI
│   │   │   ├── notifications/  # Notification center
│   │   │   ├── settings/       # User settings
│   │   │   └── admin/          # Admin panel
│   │   ├── sign-in/            # Clerk sign-in
│   │   └── sign-up/            # Clerk sign-up
│   ├── components/
│   │   ├── code-police/        # Code Police components
│   │   ├── self-healing/       # Self-Healing components (7)
│   │   ├── dashboard/          # Dashboard shell
│   │   ├── layout/             # Header, Footer, Hero sections
│   │   └── ui/                 # 44 reusable UI components
│   ├── lib/
│   │   ├── agents/
│   │   │   ├── code-police/    # Analyzer, Fix Generator, PR Creator, etc.
│   │   │   └── self-healing/   # Orchestrator, Bug Scanner, Fix Engineer, etc.
│   │   ├── blockchain/         # Ethers.js attestation service
│   │   ├── firebase/           # Admin SDK + Client SDK init
│   │   └── utils/              # Shared utilities
│   └── types/                  # TypeScript type definitions
├── artifacts/                  # Compiled contract ABIs
├── typechain-types/            # Auto-generated contract typings
├── hardhat.config.ts           # Hardhat / Sepolia config
├── middleware.ts               # Clerk route protection
├── firebase.json               # Firebase project config
└── package.json
```

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | `GET` | Health check — reports service status |
| **Auth & User** | | |
| `/api/auth/github/status` | `GET` `DELETE` | Check/disconnect GitHub OAuth |
| `/api/user/init` | `POST` | Initialize user document in Firestore |
| `/api/user/usage` | `GET` `POST` | Usage stats & plan management |
| **Code Police** | | |
| `/api/code-police/projects` | `GET` `POST` | List/create projects |
| `/api/code-police/projects/[id]` | `GET` `PATCH` `DELETE` | Manage individual project |
| `/api/code-police/analyze` | `POST` | Trigger commit analysis |
| `/api/code-police/analyze-repo` | `POST` | Full repository analysis |
| `/api/code-police/issues` | `GET` `POST` | Fetch issues / generate auto-fix PR |
| `/api/code-police/analytics` | `GET` | Repository health analytics |
| `/api/code-police/disconnect` | `POST` | Disconnect repository |
| **Self-Healing** | | |
| `/api/self-healing/start` | `POST` | Start autonomous healing session |
| `/api/self-healing/stream/[sessionId]` | `GET` | SSE live progress stream |
| `/api/self-healing/sessions` | `GET` | List all sessions |
| `/api/self-healing/sessions/[id]` | `GET` | Session details |
| `/api/self-healing/sessions/[id]/fail` | `POST` | Mark session as failed |
| `/api/self-healing/attestations/[sessionId]` | `GET` | On-chain attestation records |
| **Webhooks** | | |
| `/api/webhooks/github` | `POST` | GitHub push/PR webhook handler |
| `/api/webhooks/clerk` | `POST` | Clerk user lifecycle sync |
| **GitHub** | | |
| `/api/github/repos` | `GET` | List user's GitHub repos |
| `/api/github/connect` | `POST` | Connect repo + create webhook |
| **Dashboard & Admin** | | |
| `/api/dashboard/stats` | `GET` | Aggregated dashboard statistics |
| `/api/admin/stats` | `GET` | Admin-only platform stats |
| `/api/admin/users` | `GET` | Admin-only user list |
| `/api/admin/users/[userId]` | `GET` `PATCH` | Admin user management |
| `/api/admin/projects` | `GET` | Admin project list |
| `/api/admin/activities` | `GET` | Admin activity log |
| `/api/notifications` | `PATCH` `DELETE` | Manage notifications |
| `/api/projects` | `GET` `POST` `PATCH` `DELETE` | Unified project CRUD |

---

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all [environment variables](#environment-variables) in the Vercel dashboard under **Settings → Environment Variables**.

### Netlify

The project includes a `netlify.toml` with pre-configured build settings and the `@netlify/plugin-nextjs` plugin.

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Render

The live instance runs on [Render](https://render.com). Configure a new **Web Service** pointing to the repository with:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

---

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/zaidkhan-sudo">
        <img src="https://github.com/zaidkhan-sudo.png" width="80px;" alt="Zaid Khan" /><br />
        <sub><b>Zaid Khan</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Mohnish27-dev">
        <img src="https://github.com/Mohnish27-dev.png" width="80px;" alt="Mohnish Pamnani" /><br />
        <sub><b>Mohnish Pamnani</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/anurag3407">
        <img src="https://github.com/anurag3407.png" width="80px;" alt="Anurag Mishra" /><br />
        <sub><b>Anurag Mishra</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/JaiswalShivang">
        <img src="https://github.com/JaiswalShivang.png" width="80px;" alt="Shivang Jaiswal" /><br />
        <sub><b>Shivang Jaiswal</b></sub>
      </a>
    </td>
  </tr>
</table>

---

<p align="center">
  <a href="https://www.linkedin.com/posts/anurag3407_buildinpublic-ai-devops-ugcPost-7430423451787735040--8Gk">LinkedIn</a> ·
  <a href="https://protocol-zero-tnbi.onrender.com/">Live Demo</a> ·
  <a href="https://github.com/zaidkhan-sudo/protocol_zero">GitHub</a>
</p>

<p align="center">
  Built with 🛡️ by the Protocol Zero Team
</p>
