# Dependency Graph
<!-- [F:DOC.03] For each file: what it reads, and what reads it -->

## [F:ROOT.05] docker-compose.yml
- **Reads env:** [V:POSTIZ_BASE_URL], [V:POSTIZ_API_KEY], [V:JWT_SECRET], [V:POSTIZ_PORT], [V:MCP_PORT], [V:TEMPORAL_UI_PORT], all platform keys
- **Read by:** [F:SCRIPT.03]
- **Features:** ALL

## [F:ROOT.06] .mcp.json
- **Reads env:** [V:POSTIZ_MCP_URL]
- **Read by:** Claude Code (auto-loaded)
- **Features:** ALL
- **Migration note:** Update URL when POSTIZ_BASE_URL changes

## [F:CMD.01] .claude/commands/post.md
- **Reads:** [F:SKILL.01], [F:SKILL.02], [F:CONFIG.04], [F:TMPL.01]-[F:TMPL.04]
- **Uses vars:** [V:POSTIZ_API_KEY]
- **Calls MCP:** [V:MCP_INTEGRATION_SCHEMA], [V:MCP_SCHEDULE_POST], [V:MCP_GENERATE_IMAGE]
- **Read by:** (user-invoked)
- **Features:** [FEAT:POST]

## [F:CMD.02] .claude/commands/draft.md
- **Reads:** [F:SKILL.01], [F:SKILL.02], [F:TMPL.01]-[F:TMPL.04]
- **Uses vars:** (none)
- **Calls MCP:** (none)
- **Read by:** (user-invoked)
- **Features:** [FEAT:DRAFT]

## [F:CMD.03] .claude/commands/schedule.md
- **Reads:** [F:CONFIG.04], [F:SKILL.03]
- **Uses vars:** [V:POSTIZ_API_KEY]
- **Calls MCP:** [V:MCP_SCHEDULE_POST]
- **Read by:** (user-invoked)
- **Features:** [FEAT:SCHEDULE]

## [F:CMD.04] .claude/commands/analytics.md
- **Reads:** [F:CONFIG.04]
- **Uses vars:** [V:POSTIZ_API_KEY], [V:EP_INTEGRATIONS]
- **Calls MCP:** [V:MCP_INTEGRATION_LIST], [V:MCP_PLAYWRIGHT] (fallback)
- **Read by:** (user-invoked)
- **Features:** [FEAT:ANALYTICS]

## [F:CMD.05] .claude/commands/browse-social.md
- **Reads:** [F:CONFIG.03], [F:SKILL.04]
- **Uses vars:** (none)
- **Calls MCP:** [V:MCP_PLAYWRIGHT]
- **Read by:** [F:CMD.04] (fallback), (user-invoked)
- **Features:** [FEAT:BROWSE], [FEAT:ANALYTICS]

## [F:CMD.06] .claude/commands/repurpose.md
- **Reads:** [F:SKILL.01], [F:SKILL.02], [F:TMPL.01]-[F:TMPL.04]
- **Uses vars:** [V:POSTIZ_API_KEY] (if publishing)
- **Calls MCP:** [V:MCP_GENERATE_IMAGE] (optional)
- **Read by:** (user-invoked)
- **Features:** [FEAT:REPURPOSE]

## [F:CMD.07] .claude/commands/audit.md
- **Reads:** [F:CONFIG.03]
- **Uses vars:** (none)
- **Calls MCP:** [V:MCP_PLAYWRIGHT]
- **Read by:** (user-invoked)
- **Features:** [FEAT:AUDIT]

## [F:CMD.08] .claude/commands/index-check.md
- **Reads:** [F:DOC.01]-[F:DOC.04]
- **Calls:** [F:SCRIPT.01]
- **Read by:** (user-invoked)
- **Features:** [FEAT:INDEX]

## [F:SKILL.01] skills/social-voice.md
- **Reads:** (none)
- **Read by:** [F:CMD.01], [F:CMD.02], [F:CMD.06]
- **Features:** [FEAT:POST], [FEAT:DRAFT], [FEAT:REPURPOSE]

## [F:SKILL.02] skills/post-formats.md
- **Reads:** (none)
- **Read by:** [F:CMD.01], [F:CMD.02], [F:CMD.06]
- **Features:** [FEAT:POST], [FEAT:DRAFT], [FEAT:REPURPOSE]

## [F:SKILL.03] skills/content-calendar.md
- **Reads:** (none)
- **Read by:** [F:CMD.03]
- **Features:** [FEAT:SCHEDULE]

## [F:SKILL.04] skills/engagement-rules.md
- **Reads:** (none)
- **Read by:** [F:CMD.05]
- **Features:** [FEAT:BROWSE]

## [F:CONFIG.04] config/linkedin-channels.json
- **Populated by:** [F:SCRIPT.02]
- **Read by:** [F:CMD.01], [F:CMD.03], [F:CMD.04]
- **Features:** [FEAT:POST], [FEAT:SCHEDULE], [FEAT:ANALYTICS]

## [F:SCRIPT.02] scripts/sync-channels.sh
- **Uses vars:** [V:POSTIZ_API_KEY], [V:POSTIZ_BASE_URL]
- **Writes:** [F:CONFIG.04]
- **Features:** [FEAT:ANALYTICS]

## [F:SCRIPT.03] scripts/health-check.sh
- **Reads:** [F:ROOT.03], [F:ROOT.05], [F:ROOT.06]
- **Features:** ALL
