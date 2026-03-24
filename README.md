# 10x Social Media

AI-powered social media management for teams. Create, schedule, track, and
analyze posts across 13 platforms — all from your terminal or browser.

## Quick Start

```bash
# 1. Clone the repo
git clone <repo-url>
cd 10x-Social-Media

# 2. Open in Claude Code
claude

# 3. Run setup
/setup
```

That's it. Claude walks you through everything:
- Creates your `.env` with your credentials
- Starts Docker services
- Guides you to create your Postiz account
- Connects your social media accounts
- Personalizes your voice and posting style
- Tests everything works

## What You Can Do

| Command | What it does |
|---------|-------------|
| `/setup` | First-time setup (start here) |
| `/post` | Write and publish a post to any platform |
| `/draft` | Draft without publishing |
| `/schedule` | Schedule posts for the future |
| `/analytics` | See how your posts are performing |
| `/track-analytics` | Capture detailed metrics over time |
| `/browse-social` | Open any site in browser for automation |
| `/repurpose` | Adapt content across platforms |
| `/audit` | Check your profile completeness |

Or use the visual dashboard at `http://localhost:4200` for calendar view,
drag-drop scheduling, and analytics charts.

## Supported Platforms

LinkedIn, Twitter/X, Facebook, Instagram, TikTok, YouTube, Reddit,
Pinterest, Threads, Bluesky, Mastodon, Discord, Dribbble

## Requirements

- [Docker Desktop](https://docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org) (LTS)
- [Claude Code](https://claude.ai/claude-code)
- [Temporal Cloud](https://cloud.temporal.io) account (free credits available)

## Mobile Access

**Claude Mobile App (Remote Control):**
```bash
claude remote-control
# Scan QR code with Claude app → full session on phone
```

**Chat Bot (Telegram/Slack/Discord/WhatsApp):**
```bash
cd opencode-plugin
npm install
cp .env.example .env
# Add your Postiz API key + channel credentials
npm run dev
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                ACCESS LAYER                      │
│  Claude Code ── terminal (skills & commands)     │
│  Claude App ─── mobile (Remote Control)          │
│  Chat Bot ───── Telegram/Slack/Discord/WhatsApp  │
│  Dashboard ──── browser (localhost:4200)          │
└──────────────────────┬──────────────────────────┘
                       │ all hit same backend
                       ▼
┌─────────────────────────────────────────────────┐
│  Postiz (Docker) ── dashboard, calendar, API     │
│  Temporal Cloud ──── reliable scheduling          │
│  Playwright MCP ──── browser automation           │
│  Analytics Tracker ─ per-post metrics over time  │
└─────────────────────────────────────────────────┘
```

See `docs/ARCHITECTURE.md` for details.
