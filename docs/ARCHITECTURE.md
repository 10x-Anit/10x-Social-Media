# Architecture
<!-- [F:DOC.06] System overview and data flow -->

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR MACHINE                           │
│                                                             │
│  ┌──────────────┐     ┌──────────────────────────────────┐  │
│  │  Claude Code  │────▶│  .mcp.json [F:ROOT.06]           │  │
│  │  (terminal)   │     │  Registers MCP servers           │  │
│  │              │     └──────────┬───────────┬───────────┘  │
│  │  /post       │               │           │               │
│  │  /draft      │               ▼           ▼               │
│  │  /schedule   │     ┌─────────────┐ ┌──────────────┐     │
│  │  /analytics  │     │ Postiz CLI  │ │ Playwright   │     │
│  │  /browse     │     │ npx postiz  │ │ MCP (local)  │     │
│  │  /repurpose  │     │ (stdio MCP) │ │              │     │
│  │  /audit      │     └──────┬──────┘ └──────┬───────┘     │
│  └──────────────┘            │               │              │
│                              ▼               │              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Docker Compose [F:ROOT.05]               │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │  Postiz App (:4200)                             │  │   │
│  │  │  - Web Dashboard (calendar, analytics)          │  │   │
│  │  │  - Public API (/api/public/v1/*)                │  │   │
│  │  │  - OAuth handlers for all platforms             │  │   │
│  │  └─────────────┬──────────────┬────────────────────┘  │   │
│  │                │              │                        │   │
│  │  ┌─────────────▼──┐  ┌───────▼────────┐  ┌────────┐  │   │
│  │  │ PostgreSQL     │  │ Redis          │  │Temporal│  │   │
│  │  │ :5432          │  │ :6379          │  │ :7233  │  │   │
│  │  │ (posts, users, │  │ (cache, queue) │  │(tasks) │  │   │
│  │  │  analytics)    │  │                │  │        │  │   │
│  │  └────────────────┘  └────────────────┘  └────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────┐                                           │
│  │  N8N (:5678) │ ← n8n-nodes-postiz for workflow automtn  │
│  └──────────────┘                                           │
│                              │                              │
└──────────────────────────────┼──────────────────────────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │     Social Media Platforms      │
              │  LinkedIn, Twitter/X, Facebook, │
              │  Instagram, TikTok, YouTube,    │
              │  Reddit, Pinterest, Threads,    │
              │  Bluesky, Mastodon, Discord,    │
              │  Dribbble                       │
              └────────────────────────────────┘
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

POSTIZ_MCP_URL=                    POSTIZ_MCP_URL=
  http://localhost:3084/sse →        https://social.yourdomain.com:3084/sse

.mcp.json postiz.url=              .mcp.json postiz.url=
  http://localhost:3084/sse →        https://social.yourdomain.com:3084/sse

docker-compose.yml                 Same docker-compose.yml
  (same file, reads .env)           + Nginx/Caddy reverse proxy with SSL

Skills, commands, templates        UNCHANGED — they use MCP tools,
                                   not direct URLs
```
