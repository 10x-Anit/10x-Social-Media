# Master Index
<!-- [F:DOC.01] Every file, ID, purpose, dependencies, and feature tags -->

## ID Namespaces

- `[F:ROOT.xx]` — Root files
- `[F:CLAUDE.xx]` — Claude Code config files
- `[F:CMD.xx]` — Slash commands
- `[F:CONFIG.xx]` — Config files
- `[F:SKILL.xx]` — Skill documents
- `[F:SCRIPT.xx]` — Scripts
- `[F:TMPL.xx]` — Templates
- `[F:DOC.xx]` — Documentation/index files
- `[V:NAME]` — Variables (env vars, API keys, URLs)
- `[FEAT:NAME]` — Features

## File Registry

| ID | Path | Purpose | Depends On | Features |
|----|------|---------|------------|----------|
| [F:ROOT.01] | CLAUDE.md | Claude Code project instructions | [F:DOC.01]-[F:DOC.06] | ALL |
| [F:ROOT.02] | README.md | Human-readable project overview | — | — |
| [F:ROOT.03] | .env | Runtime secrets (gitignored) | — | ALL |
| [F:ROOT.04] | .gitignore | Git exclusions | — | — |
| [F:ROOT.05] | docker-compose.yml | Docker services (Postiz, PG, Redis, Temporal, MCP) | [V:POSTIZ_BASE_URL], [V:POSTIZ_API_KEY], [V:JWT_SECRET] | ALL |
| [F:ROOT.06] | .mcp.json | MCP server registration for Claude Code | [V:POSTIZ_MCP_URL] | ALL |
| [F:CONFIG.01] | config/.env.example | Env var template (no secrets) | — | — |
| [F:CONFIG.02] | config/postiz.json | Postiz MCP connection docs | [V:POSTIZ_API_KEY], [V:POSTIZ_MCP_URL] | [FEAT:POST], [FEAT:SCHEDULE], [FEAT:ANALYTICS] |
| [F:CONFIG.03] | config/playwright.json | Playwright MCP config docs | — | [FEAT:BROWSE], [FEAT:AUDIT] |
| [F:CONFIG.04] | config/linkedin-channels.json | Cached integration IDs | [V:POSTIZ_API_KEY] | [FEAT:POST], [FEAT:SCHEDULE], [FEAT:ANALYTICS] |
| [F:SKILL.01] | skills/social-voice.md | Voice/tone rules for all platforms | — | [FEAT:POST], [FEAT:DRAFT], [FEAT:REPURPOSE] |
| [F:SKILL.02] | skills/post-formats.md | Post format templates per platform | — | [FEAT:POST], [FEAT:DRAFT], [FEAT:REPURPOSE] |
| [F:SKILL.03] | skills/content-calendar.md | Cadence + topic rotation | — | [FEAT:SCHEDULE] |
| [F:SKILL.04] | skills/engagement-rules.md | Comment/reply/engagement rules | — | [FEAT:BROWSE] |
| [F:TMPL.01] | templates/post-text.md | Plain text post template | — | [FEAT:POST], [FEAT:DRAFT] |
| [F:TMPL.02] | templates/post-carousel.md | Carousel/document template | — | [FEAT:POST], [FEAT:DRAFT] |
| [F:TMPL.03] | templates/post-poll.md | Poll post template | — | [FEAT:POST], [FEAT:DRAFT] |
| [F:TMPL.04] | templates/post-article.md | Long-form article template | — | [FEAT:POST], [FEAT:DRAFT] |
| [F:CMD.01] | .claude/commands/post.md | /post — Create + publish to any platform | [F:SKILL.01], [F:SKILL.02], [F:CONFIG.04], [V:POSTIZ_API_KEY] | [FEAT:POST] |
| [F:CMD.02] | .claude/commands/draft.md | /draft — Draft without publishing | [F:SKILL.01], [F:SKILL.02], [F:TMPL.01]-[F:TMPL.04] | [FEAT:DRAFT] |
| [F:CMD.03] | .claude/commands/schedule.md | /schedule — Schedule a drafted post | [F:CONFIG.04], [F:SKILL.03], [V:POSTIZ_API_KEY] | [FEAT:SCHEDULE] |
| [F:CMD.04] | .claude/commands/analytics.md | /analytics — Pull per-post metrics | [F:CONFIG.04], [V:POSTIZ_API_KEY] | [FEAT:ANALYTICS] |
| [F:CMD.05] | .claude/commands/browse-social.md | /browse-social — Playwright automation | [F:CONFIG.03] | [FEAT:BROWSE] |
| [F:CMD.06] | .claude/commands/repurpose.md | /repurpose — Reformat content cross-platform | [F:SKILL.01], [F:SKILL.02], [F:TMPL.01]-[F:TMPL.04] | [FEAT:REPURPOSE] |
| [F:CMD.07] | .claude/commands/audit.md | /audit — Profile completeness audit | [F:CONFIG.03] | [FEAT:AUDIT] |
| [F:CMD.08] | .claude/commands/index-check.md | /index-check — Validate index integrity | [F:DOC.01]-[F:DOC.04] | [FEAT:INDEX] |
| [F:CMD.09] | .claude/commands/track-analytics.md | /track-analytics — Capture + record metrics | [F:SKILL.05], [F:SKILL.06], [F:DATA.01] | [FEAT:ANALYTICS] |
| [F:CMD.10] | .claude/commands/setup.md | /setup — Full automated onboarding | ALL | ALL |
| [F:SKILL.05] | .claude/skills/browser-automation.md | Playwright Snapshot→Act→Verify playbook | — | [FEAT:BROWSE], [FEAT:ANALYTICS], [FEAT:AUDIT] |
| [F:SKILL.06] | .claude/skills/analytics-tracking.md | Per-post time-series tracking system | [F:DATA.01] | [FEAT:ANALYTICS] |
| [F:SKILL.07] | .claude/skills/onboarding-checks.md | Pre-flight checks before any command | — | ALL |
| [F:DATA.01] | data/analytics-tracker.json | Persistent per-post analytics store | — | [FEAT:ANALYTICS] |
| [F:PLUGIN.01] | openanalyst-plugin/ | OpenAnalyst chat-channel plugin (Telegram/Slack/Discord/WhatsApp) | [V:POSTIZ_API_KEY], [V:POSTIZ_BASE_URL] | [FEAT:POST], [FEAT:ANALYTICS] |
| [F:SCRIPT.01] | scripts/validate-index.sh | Check all index references resolve | [F:DOC.01]-[F:DOC.04] | [FEAT:INDEX] |
| [F:SCRIPT.02] | scripts/sync-channels.sh | Refresh integration IDs from Postiz API | [V:POSTIZ_API_KEY], [V:POSTIZ_BASE_URL] | [FEAT:ANALYTICS] |
| [F:SCRIPT.03] | scripts/health-check.sh | Verify MCP + env vars + Docker | [F:ROOT.03], [F:ROOT.05], [F:ROOT.06] | ALL |
| [F:DOC.01] | docs/INDEX.md | THIS FILE — Master index | — | [FEAT:INDEX] |
| [F:DOC.02] | docs/VARIABLES.md | All vars, keys, URLs, endpoints | — | ALL |
| [F:DOC.03] | docs/DEPENDENCIES.md | File-to-file dependency graph | — | [FEAT:INDEX] |
| [F:DOC.04] | docs/FEATURES.md | Feature-to-file mapping | — | [FEAT:INDEX] |
| [F:DOC.05] | docs/API-REFERENCE.md | Postiz API + MCP tools reference | — | ALL |
| [F:DOC.06] | docs/ARCHITECTURE.md | System overview + data flow | — | — |
