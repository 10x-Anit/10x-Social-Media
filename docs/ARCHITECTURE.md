# Architecture
<!-- [F:DOC.06] System overview and data flow -->

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR MACHINE                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ACCESS LAYER                             │   │
│  │                                                       │   │
│  │  Claude Code ─── terminal (/post, /analytics, etc.)   │   │
│  │  Claude App ──── mobile (Remote Control)              │   │
│  │  Chat Bots ───── openanalyst-plugin/ (TG/Slack/DC/WA)   │   │
│  │  Dashboard ───── browser (localhost:4200)              │   │
│  └──────────────┬───────────┬──────────────┬────────────┘   │
│                 │           │              │                 │
│                 ▼           ▼              ▼                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐                │
│  │ Postiz   │ │ Composio │ │ Playwright   │                │
│  │ CLI/MCP  │ │ MCP      │ │ MCP          │                │
│  │ (posts,  │ │ (OAuth,  │ │ (browser     │                │
│  │ schedule)│ │ API tools│ │  automation)  │                │
│  └────┬─────┘ └────┬─────┘ └──────────────┘                │
│       │             │                                       │
│       ▼             ▼                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Docker (3 containers)                    │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │  Postiz App (:4200)                             │  │   │
│  │  │  - Dashboard, calendar, visual scheduling       │  │   │
│  │  │  - Public API (/api/public/v1/*)                │  │   │
│  │  │  - OAuth (or Composio handles auth)             │  │   │
│  │  └─────────────┬──────────────┬────────────────────┘  │   │
│  │                │              │                        │   │
│  │  ┌─────────────▼──┐  ┌───────▼────────┐              │   │
│  │  │ PostgreSQL     │  │ Redis          │              │   │
│  │  │ (posts, users, │  │ (cache, queue) │              │   │
│  │  │  analytics)    │  │                │              │   │
│  │  └────────────────┘  └────────────────┘              │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                              │
└──────────────────────────────┼──────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
   Temporal Cloud      Composio Cloud    Social Platforms
   (scheduling,        (managed OAuth)   LinkedIn, Twitter/X,
    retries)                             Facebook, Instagram,
                                         TikTok, YouTube, etc.
```

## Data Flow: Creating a Post

```
User: "Post about our product launch on LinkedIn and Twitter"
  │
  ▼
Claude Code reads:
  ├── skills/social-voice.md [F:SKILL.01]     (how to write)
  ├── skills/post-formats.md [F:SKILL.02]     (platform-specific formatting)
  └── config/linkedin-channels.json [F:CONFIG.04]  (integration IDs)
  │
  ▼
Claude drafts platform-specific content
  │
  ▼
Claude calls Postiz MCP:
  ├── integrationSchema → get required fields per platform
  ├── generateImageTool → create image if needed
  └── schedulePostTool → publish/schedule the post
  │
  ▼
Postiz App → Platform APIs → Post goes live
```

## Data Flow: Pulling Analytics

```
User: "Show me how my last 5 posts performed"
  │
  ▼
Claude calls Postiz MCP:
  └── integrationList → get all connected accounts
  │
  ▼
Claude calls Postiz API:
  └── GET /api/public/v1/integrations → post history + metrics
  │
  ▼
If deeper metrics needed (not in API):
  └── Playwright MCP → opens platform in browser
      ├── Navigate to post analytics page
      ├── browser_snapshot → read accessibility tree
      └── Extract: likes, comments, shares, impressions, reach
  │
  ▼
Claude formats results as table/report
```

## Migration: Local → Remote Server

```
LOCAL                              REMOTE
──────                             ──────
POSTIZ_BASE_URL=                   POSTIZ_BASE_URL=
  http://localhost:4200     →        https://social.yourdomain.com

docker-compose.yml                 Same docker-compose.yml
  (same file, reads .env)           + Nginx/Caddy reverse proxy with SSL

openanalyst-plugin/.env               Update POSTIZ_BASE_URL to remote URL
  POSTIZ_BASE_URL=localhost  →      POSTIZ_BASE_URL=https://social.yourdomain.com

Skills, commands, templates,       UNCHANGED — they use MCP tools
MCP servers, Composio, Temporal    and env vars, not hardcoded URLs
```
