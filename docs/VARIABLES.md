# Variable Registry
<!-- [F:DOC.02] Every env var, API key, URL, endpoint, MCP tool, and constant -->

## Environment Variables

| ID | Name | Type | Required | Source | Consumers | Sensitivity |
|----|------|------|----------|--------|-----------|-------------|
| [V:POSTIZ_BASE_URL] | POSTIZ_BASE_URL | url | YES | User config | [F:ROOT.03], [F:ROOT.05] | PUBLIC |
| [V:POSTIZ_API_KEY] | POSTIZ_API_KEY | string | YES | Postiz Dashboard > Settings > Developers | [F:ROOT.03], [F:ROOT.05], [F:CMD.01], [F:CMD.03], [F:CMD.04], [F:SCRIPT.02] | SECRET |
| [V:POSTIZ_MCP_URL] | POSTIZ_MCP_URL | url | YES | Derived from POSTIZ_BASE_URL | [F:ROOT.03], [F:ROOT.06], [F:CONFIG.02] | PUBLIC |
| [V:JWT_SECRET] | JWT_SECRET | string | YES | Generated (openssl rand -base64 32) | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:POSTIZ_PORT] | POSTIZ_PORT | number | NO | Default: 4200 | [F:ROOT.03], [F:ROOT.05] | PUBLIC |
| [V:MCP_PORT] | MCP_PORT | number | NO | Default: 3084 | [F:ROOT.03], [F:ROOT.05] | PUBLIC |
| [V:TEMPORAL_UI_PORT] | TEMPORAL_UI_PORT | number | NO | Default: 8080 | [F:ROOT.03], [F:ROOT.05] | PUBLIC |

## Platform Keys (all optional — add per platform you use)

| ID | Name | Platform | Consumers | Sensitivity |
|----|------|----------|-----------|-------------|
| [V:LINKEDIN_CLIENT_ID] | LINKEDIN_CLIENT_ID | LinkedIn | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:LINKEDIN_CLIENT_SECRET] | LINKEDIN_CLIENT_SECRET | LinkedIn | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:X_API_KEY] | X_API_KEY | Twitter/X | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:X_API_SECRET] | X_API_SECRET | Twitter/X | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:FACEBOOK_CLIENT_ID] | FACEBOOK_CLIENT_ID | Facebook+Instagram | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:FACEBOOK_CLIENT_SECRET] | FACEBOOK_CLIENT_SECRET | Facebook+Instagram | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:TIKTOK_CLIENT_ID] | TIKTOK_CLIENT_ID | TikTok | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:TIKTOK_CLIENT_SECRET] | TIKTOK_CLIENT_SECRET | TikTok | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:YOUTUBE_CLIENT_ID] | YOUTUBE_CLIENT_ID | YouTube | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:YOUTUBE_CLIENT_SECRET] | YOUTUBE_CLIENT_SECRET | YouTube | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:REDDIT_CLIENT_ID] | REDDIT_CLIENT_ID | Reddit | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:REDDIT_CLIENT_SECRET] | REDDIT_CLIENT_SECRET | Reddit | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:PINTEREST_CLIENT_ID] | PINTEREST_CLIENT_ID | Pinterest | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:PINTEREST_CLIENT_SECRET] | PINTEREST_CLIENT_SECRET | Pinterest | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:THREADS_CLIENT_ID] | THREADS_CLIENT_ID | Threads | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:THREADS_CLIENT_SECRET] | THREADS_CLIENT_SECRET | Threads | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:DISCORD_CLIENT_ID] | DISCORD_CLIENT_ID | Discord | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:DISCORD_CLIENT_SECRET] | DISCORD_CLIENT_SECRET | Discord | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:MASTODON_CLIENT_ID] | MASTODON_CLIENT_ID | Mastodon | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:MASTODON_CLIENT_SECRET] | MASTODON_CLIENT_SECRET | Mastodon | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:DRIBBBLE_CLIENT_ID] | DRIBBBLE_CLIENT_ID | Dribbble | [F:ROOT.03], [F:ROOT.05] | SECRET |
| [V:DRIBBBLE_CLIENT_SECRET] | DRIBBBLE_CLIENT_SECRET | Dribbble | [F:ROOT.03], [F:ROOT.05] | SECRET |

## API Endpoints (Postiz Public API)

| ID | Endpoint | Method | Auth | Rate Limit | Consumers |
|----|----------|--------|------|------------|-----------|
| [V:EP_INTEGRATIONS] | /api/public/v1/integrations | GET | API Key | 30/hr | [F:SCRIPT.02], [F:CMD.04] |
| [V:EP_POSTS] | /api/public/v1/posts | POST | API Key | 30/hr | [F:CMD.01], [F:CMD.03] |
| [V:EP_UPLOAD] | /api/public/v1/upload | POST | API Key | 30/hr | [F:CMD.01] |

## MCP Tool References

| ID | Tool Name | MCP Server | Key Parameters | Consumers |
|----|-----------|------------|----------------|-----------|
| [V:MCP_INTEGRATION_LIST] | integrationList | postiz | (none) | [F:CMD.04], [F:SCRIPT.02] |
| [V:MCP_SCHEDULE_POST] | schedulePostTool | postiz | socialPost[] | [F:CMD.01], [F:CMD.03] |
| [V:MCP_INTEGRATION_SCHEMA] | integrationSchema | postiz | platform, isPremium | [F:CMD.01] |
| [V:MCP_TRIGGER_TOOL] | triggerTool | postiz | integrationId, methodName | [F:CMD.01] |
| [V:MCP_GENERATE_IMAGE] | generateImageTool | postiz | prompt | [F:CMD.01], [F:CMD.06] |
| [V:MCP_GENERATE_VIDEO_OPTS] | generateVideoOptions | postiz | (none) | [F:CMD.01] |
| [V:MCP_VIDEO_FUNCTION] | videoFunctionTool | postiz | identifier, functionName | [F:CMD.01] |
| [V:MCP_GENERATE_VIDEO] | generateVideoTool | postiz | identifier, output, customParams | [F:CMD.01] |
| [V:MCP_PLAYWRIGHT] | (all browser tools) | playwright | (varies) | [F:CMD.05], [F:CMD.07] |

## Constants

| ID | Name | Value | Consumers |
|----|------|-------|-----------|
| [V:RATE_LIMIT] | Postiz API Rate Limit | 30 req/hr | [F:CMD.01]-[F:CMD.04] |
| [V:CONTENT_HTML_TAGS] | Allowed HTML in posts | p, h1-h6, strong, u, ul, ol, li | [F:SKILL.02], [F:TMPL.01]-[F:TMPL.04] |

## Migration Checklist

When moving from local to remote server, update these variables:
1. `[V:POSTIZ_BASE_URL]` → your domain (e.g., `https://social.yourdomain.com`)
2. `MAIN_URL`, `FRONTEND_URL`, `NEXT_PUBLIC_BACKEND_URL` → match base URL
3. `[V:POSTIZ_MCP_URL]` → `https://social.yourdomain.com:3084/sse`
4. Update `.mcp.json` [F:ROOT.06] → new MCP URL
5. `docker compose up -d` on the server
