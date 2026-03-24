# 10x Social Media — Multi-Platform Management Stack
<!-- [F:ROOT.01] Claude Code project instructions -->

## Overview
AI-powered social media management via Claude Code + Postiz (Docker) + Playwright MCP.
Supports: LinkedIn, Twitter/X, Facebook, Instagram, TikTok, YouTube, Reddit, Pinterest, Threads, Bluesky, Mastodon, Discord, Dribbble.

## Docker Services (docker-compose.yml)
- **Postiz App** → `http://localhost:4200` (dashboard, API, OAuth)
- **PostgreSQL** → internal :5432 (posts, users, analytics)
- **Redis** → internal :6379 (cache, queue)
- **Temporal** → internal :7233 (scheduled tasks)
- **Temporal UI** → `http://localhost:8080` (workflow monitoring)

## MCP Servers (registered in .mcp.json, run locally via npx)
- **postiz**: `npx postiz` (CLI/stdio) — posting, scheduling, per-post analytics
- **playwright**: `npx @playwright/mcp@latest` — browser automation

## Postiz CLI Commands (available as MCP tools + terminal)
- `postiz posts:create` — create a post
- `postiz posts:list` — list all posts
- `postiz integrations:list` — list connected platforms
- `postiz analytics:platform <id>` — platform-level analytics
- `postiz analytics:post <id>` — per-post metrics (likes, comments, reach)
- `postiz upload <file>` — upload media

## N8N Integration
- N8N running at `http://localhost:5678`
- npm package `n8n-nodes-postiz` available for workflow automation
- Can trigger Postiz actions from N8N workflows

## Slash Commands

| Command | Purpose | Index ID |
|---------|---------|----------|
| /post | Create + publish to any platform | [F:CMD.01] |
| /draft | Draft without publishing | [F:CMD.02] |
| /schedule | Schedule a post for later | [F:CMD.03] |
| /analytics | Pull per-post metrics (likes, comments, reach) | [F:CMD.04] |
| /browse-social | Playwright browser session | [F:CMD.05] |
| /repurpose | Reformat content cross-platform | [F:CMD.06] |
| /audit | Profile completeness audit | [F:CMD.07] |
| /index-check | Validate index integrity | [F:CMD.08] |

## Before Any Post
1. Read `skills/social-voice.md` [F:SKILL.01] for tone
2. Read `skills/post-formats.md` [F:SKILL.02] for platform-specific structure
3. Read `config/linkedin-channels.json` [F:CONFIG.04] for integration IDs
4. Check `skills/content-calendar.md` [F:SKILL.03] for topic/timing fit

## Index System
- **Master index**: `docs/INDEX.md` [F:DOC.01] — every file, ID, cross-refs
- **Variables**: `docs/VARIABLES.md` [F:DOC.02] — all env vars, keys, endpoints
- **Dependencies**: `docs/DEPENDENCIES.md` [F:DOC.03] — file-to-file graph
- **Features**: `docs/FEATURES.md` [F:DOC.04] — feature-to-file mapping
- **API Reference**: `docs/API-REFERENCE.md` [F:DOC.05] — Postiz tools + endpoints
- **Architecture**: `docs/ARCHITECTURE.md` [F:DOC.06] — system diagram

**When adding/modifying ANY file, update all four index docs.**

## Environment
Required: `POSTIZ_BASE_URL`, `JWT_SECRET`, `POSTIZ_API_KEY`
See `config/.env.example` [F:CONFIG.01] for full list.

## Migration to Remote Server
1. Change `POSTIZ_BASE_URL` in `.env` to your domain
2. Update `MAIN_URL`, `FRONTEND_URL`, `NEXT_PUBLIC_BACKEND_URL` to match
3. Update `POSTIZ_MCP_URL` to `https://yourdomain.com:3084/sse`
4. Update `.mcp.json` [F:ROOT.06] postiz URL to match
5. Add reverse proxy (Nginx/Caddy) with SSL
6. `docker compose up -d` on the server
7. All skills and commands work unchanged — they use MCP, not direct URLs

## Post Analytics Tracking
Every post tracks: Likes/Reactions, Comments, Shares, Impressions, Reach, Engagement Rate, Click-through, Saves/Bookmarks. Use `/analytics` to pull metrics for any post on any connected platform.
