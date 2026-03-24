<p align="center">
  <strong>10x Social Media</strong><br>
  <em>AI-Powered Social Media Management for Teams</em><br>
  <sub>Built by <a href="https://10x.in">team 10x.in</a></sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platforms-13-blue" alt="Platforms">
  <img src="https://img.shields.io/badge/commands-10-green" alt="Commands">
  <img src="https://img.shields.io/badge/channels-4-orange" alt="Channels">
  <img src="https://img.shields.io/badge/license-private-red" alt="License">
</p>

---

## What is this?

A complete social media management system that your team clones, runs `/setup`, and Claude AI builds their entire environment — installs dependencies, creates configs, connects accounts, personalizes voice. No technical knowledge needed.

**One command. Full setup. AI does the rest.**

```bash
git clone https://github.com/10x-Anit/10x-Social-Media.git
cd 10x-Social-Media
claude
/setup
```

---

## System Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER INTERFACES                          │
│                                                                  │
│  Terminal ─────── Claude Code (/post, /analytics, /schedule)     │
│  Phone ────────── Claude Mobile App (Remote Control)             │
│  Chat ─────────── Telegram / Slack / Discord / WhatsApp          │
│  Browser ──────── Postiz Dashboard (localhost:4200)               │
│                                                                  │
│  All 4 interfaces share the same backend.                        │
│  A post created in chat shows in the dashboard and vice versa.   │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
         ┌──────────┐ ┌──────────┐ ┌──────────────┐
         │ Postiz   │ │ Composio │ │ Playwright   │
         │ MCP      │ │ MCP      │ │ MCP          │
         │          │ │          │ │              │
         │ Post     │ │ One-click│ │ Browser      │
         │ Schedule │ │ OAuth    │ │ automation   │
         │ Analytics│ │ API tools│ │ for any page │
         └────┬─────┘ └────┬─────┘ └──────────────┘
              │            │
              ▼            ▼
┌──────────────────────────────────────────────────────────────────┐
│                     INFRASTRUCTURE                               │
│                                                                  │
│  Docker (3 containers):                                          │
│    Postiz App (:4200) ─── dashboard, calendar, API, OAuth        │
│    PostgreSQL ──────────── posts, users, analytics data           │
│    Redis ───────────────── cache, queue                           │
│                                                                  │
│  Cloud Services:                                                 │
│    Temporal Cloud ──────── reliable scheduling & retries          │
│    Composio ────────────── managed OAuth (no developer apps)      │
│                                                                  │
│  Local Data:                                                     │
│    analytics-tracker.json ── per-post metrics over time           │
│    skills/ ─────────────── voice, formats, calendar, engagement   │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌────────────────────────┐
              │   Social Platforms     │
              │                        │
              │   LinkedIn   Twitter   │
              │   Facebook   Instagram │
              │   TikTok     YouTube   │
              │   Reddit     Pinterest │
              │   Threads    Bluesky   │
              │   Mastodon   Discord   │
              │   Dribbble             │
              └────────────────────────┘
```

---

## User Journey

### First-time setup (10 minutes)

```
You: /setup

Claude: "Welcome! Let me set up everything for you."
  │
  ├── Checks your system (Docker, Node.js)
  │   └── Missing? "Can I install it?" → installs automatically
  │
  ├── Creates your .env file
  │   └── Generates secrets, asks for Temporal + Composio keys
  │
  ├── Starts Docker services
  │   └── docker compose up -d → waits for healthy
  │
  ├── Guides account creation
  │   └── "Open localhost:4200, register, paste your API key"
  │
  ├── Connects social media accounts
  │   └── Via Composio (click a link) or dashboard (OAuth)
  │
  ├── Personalizes your voice
  │   └── "What's your tone? Topics? Posting schedule?"
  │
  ├── Runs a test draft
  │   └── "Give me a topic — I'll write a sample post"
  │
  └── Done. Writes .setup-complete marker.
      └── Future /setup runs detect this and offer reconfigure options.
```

### Daily usage

```
You: /post Write about our new AI feature for LinkedIn

Claude: Reads your voice rules, drafts the post
  │
  ├── "You have 2 LinkedIn accounts:
  │    1. Your Profile (personal)
  │    2. OpenAnalyst (company page)
  │    Which one?"
  │
  You: "company"
  │
  ├── Shows draft with character count
  │    "Ready to publish? (yes / edit / cancel)"
  │
  You: "yes"
  │
  └── ✅ Published to OpenAnalyst (LinkedIn)
      📊 Tracking metrics automatically
```

```
You: /analytics How did my last 3 posts do?

Claude: Pulls data from Postiz API + Playwright scraping
  │
  └── Shows comparison table:
      Post              │ Impr  │ Likes │ Eng Rate
      "AI feature..."   │ 3,400 │ 78    │ 3.1%
      "Q1 results..."   │ 5,200 │ 92    │ 2.7%
      "Team update..."  │ 1,800 │ 34    │ 5.7%

      Best: "Team update" — polls drive 2x engagement
```

```
You: /schedule Post about product launch on Tuesday 9am

Claude: Reads content-calendar.md for optimal times
  │
  └── ✅ Scheduled for Tuesday 9:00 AM
      Temporal Cloud will deliver at the exact time
```

---

## Commands

| Command | What it does | Needs Docker? |
|---------|-------------|---------------|
| `/setup` | Full automated setup — start here | Yes (installs if missing) |
| `/post` | Write and publish to any platform | Yes |
| `/draft` | Draft without publishing | No |
| `/schedule` | Schedule posts for the future | Yes |
| `/analytics` | See post performance metrics | Yes |
| `/track-analytics` | Capture metrics over time (time-series) | Yes |
| `/browse-social` | Browser automation for any page | No |
| `/repurpose` | Adapt content across platforms | No |
| `/audit` | Profile completeness check with scoring | No |

---

## Use Cases

### For Marketing Teams
- Write and schedule a week of posts in one session
- Track engagement across all platforms in one report
- Repurpose best-performing LinkedIn posts as Twitter threads
- Audit team members' profiles quarterly

### For Founders / Solo Operators
- "Post about our product launch on LinkedIn, Twitter, and Instagram"
- Schedule content while traveling — use Claude mobile app
- Get weekly summaries: "What content worked best this week?"

### For Agencies
- Each client gets their own connected accounts
- Manage multiple brands from one system
- Pull cross-platform analytics reports for client meetings
- Use chat bot for quick approvals from clients via Telegram

---

## Supported Platforms (13)

| Platform | Post | Schedule | Analytics | Browser Automation |
|----------|------|----------|-----------|-------------------|
| LinkedIn | Yes | Yes | Yes | Yes |
| Twitter / X | Yes | Yes | Yes | Yes |
| Facebook | Yes | Yes | Yes | Yes |
| Instagram | Yes | Yes | Yes | Yes |
| TikTok | Yes | Yes | Yes | Yes |
| YouTube | Yes | Yes | Yes | Yes |
| Reddit | Yes | Yes | Yes | Yes |
| Pinterest | Yes | Yes | Yes | Yes |
| Threads | Yes | Yes | Yes | Yes |
| Bluesky | Yes | Yes | Yes | Yes |
| Mastodon | Yes | Yes | Yes | Yes |
| Discord | Yes | Yes | Yes | Yes |
| Dribbble | Yes | Yes | Yes | Yes |

---

## Access Methods

### 1. Terminal (Claude Code)
```bash
claude
/post "Our new feature just launched!"
```

### 2. Mobile (Claude App)
```bash
claude remote-control
# Scan QR code → full session on phone
```

### 3. Chat Bot (OpenAnalyst Plugin)
```bash
cd openanalyst-plugin
npm install && npm run build
cp .env.example .env  # add your API key + channel tokens
npm run dev
```
Then message the bot on Telegram/Slack/Discord/WhatsApp:
```
You: post about AI tools on LinkedIn
Bot: ✅ Posted to OpenAnalyst (LinkedIn)
```

### 4. Dashboard (Browser)
Open `http://localhost:4200` for visual calendar, drag-drop scheduling, and analytics charts.

---

## Requirements

Works on **Windows, macOS, and Linux**. `/setup` installs missing dependencies automatically.

| Requirement | Purpose | Auto-installed by /setup? |
|-------------|---------|--------------------------|
| Docker | Runs Postiz, PostgreSQL, Redis | Yes (with permission) |
| Node.js 18+ | MCP servers, plugin | Yes (with permission) |
| Claude Code | AI engine | Manual install |
| Temporal Cloud | Reliable scheduling | Manual signup (free credits) |
| Composio | One-click OAuth | Manual signup (free) |

---

## Step-by-Step Setup Guide

### Step 1: Clone
```bash
git clone https://github.com/10x-Anit/10x-Social-Media.git
cd 10x-Social-Media
```

### Step 2: Open Claude Code
```bash
claude
```

### Step 3: Run setup
```
/setup
```
Claude will:
- Check and install Docker + Node.js (asks permission first)
- Create your `.env` with generated secrets
- Ask for Temporal Cloud namespace + API key
- Ask for Composio API key
- Start Docker services (`docker compose up -d`)
- Guide you to create a Postiz account at `localhost:4200`
- Walk you through connecting social accounts
- Customize your posting voice and schedule
- Run a test draft
- Write `.setup-complete` marker

### Step 4: Start posting
```
/post Write about our Q1 results on LinkedIn
```

### Step 5: Check performance
```
/analytics How did my posts do this week?
```

### Step 6: Mobile access (optional)
```bash
claude remote-control
# Scan QR with Claude mobile app
```

### Step 7: Chat bot (optional)
```bash
cd openanalyst-plugin
npm install && npm run build
cp .env.example .env
# Edit .env: add POSTIZ_API_KEY + channel tokens
npm run dev
```

---

## Analytics Tracking

Every post is tracked with time-series snapshots:

```
Post: "Our new AI feature just launched"
Platform: LinkedIn | Published: Mar 25, 9:00 AM

         Hour 0    Day 1     Day 7     Day 30
Impress  120       1,200     3,400     5,100
Reach    90        890       2,100     3,200
Likes    5         45        78        92
Comments 1         12        18        21
Shares   0         5         8         10
Eng Rate 5.0%      5.2%      3.1%      2.4%
```

Ask for reports anytime:
- `/analytics` — current performance
- `/track-analytics` — capture new snapshots
- Weekly summaries, content type analysis, best posting times

---

## Project Structure

```
10x-Social-Media/
├── .claude/
│   ├── commands/          # 10 slash commands (/post, /setup, etc.)
│   └── skills/            # 7 skill files (voice, formats, automation, etc.)
├── openanalyst-plugin/    # Chat bot (Telegram/Slack/Discord/WhatsApp)
├── config/                # .env.example, platform configs
├── data/                  # Analytics tracker (time-series JSON)
├── docs/                  # INDEX, VARIABLES, DEPENDENCIES, FEATURES, API ref
├── scripts/               # Health check, channel sync, index validation
├── templates/             # Post templates (text, carousel, poll, article)
├── docker-compose.yml     # 3 services: Postiz + PostgreSQL + Redis
├── .mcp.json              # 3 MCP servers: Postiz + Composio + Playwright
├── CLAUDE.md              # Project instructions for Claude
└── README.md              # This file
```

---

## Browser Automation

Works on **any website** using Playwright MCP. No hardcoded selectors — reads the accessibility tree dynamically.

```
You: /browse-social Check my LinkedIn post analytics

Claude:
  → Opens LinkedIn in browser
  → Reads accessibility tree (not pixels)
  → Finds "Impressions: 1,234" / "Likes: 45" / "Comments: 12"
  → Records to analytics tracker
  → Shows you the report
```

---

<p align="center">
  <sub>Built with Claude Code + Postiz + Temporal Cloud + Composio + Playwright</sub><br>
  <sub>Developed by <a href="https://10x.in">team 10x.in</a></sub>
</p>
