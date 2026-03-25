# 10x Social Media — Team Social Media Management Platform
<!-- [F:ROOT.01] Claude Code project instructions -->

## What This Is
A team tool where each member connects their own social media accounts and uses
Claude Code to create, schedule, track, and analyze posts across all platforms.
No technical knowledge needed — run /setup and follow the prompts.

## CRITICAL: First-Time User Flow
**Before running ANY command, read `skills/onboarding-checks.md` [F:SKILL.07].**
If the user hasn't completed setup, guide them through /setup instead of failing.
Always be helpful. Never show raw errors. Explain what's wrong and how to fix it.

## How It Works
- **Postiz Dashboard** (`http://localhost:4200`) — Visual UI for calendar, scheduling, account management
- **Claude Code** (this terminal) — AI-powered posting, analytics, content creation
- **Both share the same database** — what you create in one shows in the other
- **Each team member** connects their own accounts and gets their own API key

## Docker Services (3 containers)
- **Postiz App** → `http://localhost:4200` (dashboard, API, OAuth)
- **PostgreSQL** → internal (posts, users, analytics)
- **Redis** → internal (cache, queue)
- **Temporal Cloud** → configured via TEMPORAL_ADDRESS in .env (scheduling, retries — managed)

## MCP Servers (.mcp.json)
- **postiz**: `npx postiz` — posting, scheduling, per-post analytics
- **composio**: `npx @composio/mcp` — one-click OAuth, platform API tools (post, analytics)
- **playwright**: `npx @playwright/mcp@latest` — browser automation for ANY page

**`.mcp.json` is NOT in git** — it's generated per-user by `/setup` (Phase 4B).
It contains user-specific API keys and OS-specific command wrappers (`cmd /c npx` on Windows, bare `npx` on Mac/Linux).
Template for reference: `config/.mcp.json.example`
If `.mcp.json` is missing or broken, run `/setup` option 3 to regenerate it.

## Composio (Account Connections)
Composio handles OAuth for social platforms — users click a link to authorize instead
of creating developer apps. Use Composio MCP tools to:
- Initiate connections (generates auth URL for user to click)
- Post directly via platform tools (LINKEDIN_CREATE_POST, TWITTER_CREATE_TWEET, etc.)
- Pull analytics via platform tools
Composio and Postiz connections work independently — use whichever is available.

## Slash Commands

| Command | Purpose | Index ID |
|---------|---------|----------|
| /setup | **First-time setup — start here** | [F:CMD.10] |
| /post | Create + publish to any platform | [F:CMD.01] |
| /draft | Draft without publishing | [F:CMD.02] |
| /schedule | Schedule a post for later | [F:CMD.03] |
| /analytics | See how posts are performing | [F:CMD.04] |
| /track-analytics | Capture + record metrics over time | [F:CMD.09] |
| /browse-social | Open any platform in browser | [F:CMD.05] |
| /repurpose | Adapt content for different platforms | [F:CMD.06] |
| /audit | Check profile completeness | [F:CMD.07] |
| /index-check | Validate index integrity | [F:CMD.08] |

## Before Any Command
1. Run onboarding checks [F:SKILL.07] — Docker running? API key set? Accounts connected?
2. If posting: ask which account if user has multiple
3. Read voice rules [F:SKILL.01] and format rules [F:SKILL.02]
4. Show draft before publishing — NEVER auto-publish

## Multi-Account Support
Team members can connect multiple accounts per platform:
- Personal LinkedIn + Company LinkedIn page
- Brand Instagram + Personal Instagram
- Multiple Twitter accounts
Always ask which account to use. Store friendly names mapped to integration IDs.

## Browser Automation
Read `skills/browser-automation.md` [F:SKILL.05] before ANY Playwright interaction.
Uses Snapshot → Act → Verify loop. Works on ANY page structure. Never hardcode selectors.

## Analytics Tracking
Per-post metrics in `data/analytics-tracker.json` [F:DATA.01].
Time-series snapshots: hour 0 → day 1 → day 7 → day 30.
Combines Postiz API data + Playwright scraped data + manual entries.
Read `skills/analytics-tracking.md` [F:SKILL.06] for schema and reports.

## Mobile Access
- **Claude Remote Control**: `claude remote-control` → scan QR with Claude app → full session on phone
- **Chat Bot**: `openanalyst-plugin/` — Telegram, Slack, Discord, WhatsApp bot connecting to same Postiz
- Both hit the same database — posts from chat bot show in dashboard and vice versa

## Supported Platforms (13)
LinkedIn, Twitter/X, Facebook, Instagram, TikTok, YouTube, Reddit,
Pinterest, Threads, Bluesky, Mastodon, Discord, Dribbble

## Postiz CLI Commands
- `postiz posts:create` — create a post
- `postiz posts:list` — list all posts
- `postiz integrations:list` — list connected platforms
- `postiz analytics:platform <id>` — platform-level analytics
- `postiz analytics:post <id>` — per-post metrics
- `postiz upload <file>` — upload media

## Index System
- Master index: `docs/INDEX.md` [F:DOC.01]
- Variables: `docs/VARIABLES.md` [F:DOC.02]
- Dependencies: `docs/DEPENDENCIES.md` [F:DOC.03]
- Features: `docs/FEATURES.md` [F:DOC.04]
- API Reference: `docs/API-REFERENCE.md` [F:DOC.05]
- Architecture: `docs/ARCHITECTURE.md` [F:DOC.06]

## Migration to Remote Server
1. Change `POSTIZ_BASE_URL` in `.env` to your domain
2. Update derived URLs to match
3. Add reverse proxy with SSL
4. `docker compose up -d` on the server
5. All skills and commands work unchanged
