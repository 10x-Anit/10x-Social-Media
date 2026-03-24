# Feature Map
<!-- [F:DOC.04] Each feature mapped to every file that implements it -->

## [FEAT:POST] — Create and Publish Posts (any platform)
**Description:** Draft a post using voice/format rules, then publish to any connected platform via Postiz.
**Platforms:** LinkedIn, Twitter/X, Facebook, Instagram, TikTok, YouTube, Reddit, Pinterest, Threads, Bluesky, Mastodon, Discord, Dribbble
**Files:**
- [F:CMD.01] .claude/commands/post.md (primary command)
- [F:SKILL.01] skills/social-voice.md (voice rules)
- [F:SKILL.02] skills/post-formats.md (format rules per platform)
- [F:CONFIG.04] config/linkedin-channels.json (integration IDs)
- [F:TMPL.01]-[F:TMPL.04] templates/* (post structure)
**Variables:** [V:POSTIZ_API_KEY], [V:MCP_SCHEDULE_POST], [V:MCP_INTEGRATION_SCHEMA], [V:MCP_GENERATE_IMAGE]

## [FEAT:DRAFT] — Draft Posts Without Publishing
**Files:** [F:CMD.02], [F:SKILL.01], [F:SKILL.02], [F:TMPL.01]-[F:TMPL.04]
**Variables:** (none — no API calls)
**MCP Tools:** (none)

## [FEAT:SCHEDULE] — Schedule Posts for Future Delivery
**Files:** [F:CMD.03], [F:CONFIG.04], [F:SKILL.03]
**Variables:** [V:POSTIZ_API_KEY], [V:MCP_SCHEDULE_POST]

## [FEAT:ANALYTICS] — Per-Post Metrics (likes, comments, impressions, reach)
**Description:** Pull individual post performance data — reactions, comments, impressions, reach, shares — for any connected platform. Uses Postiz API for structured data + Playwright for scraping platform-native analytics not exposed via API.
**Files:**
- [F:CMD.04] .claude/commands/analytics.md (primary command)
- [F:CONFIG.04] config/linkedin-channels.json (integration IDs)
- [F:CMD.05] .claude/commands/browse-social.md (fallback for deep analytics)
**Variables:** [V:POSTIZ_API_KEY], [V:MCP_INTEGRATION_LIST], [V:EP_INTEGRATIONS]
**Metrics tracked per post:**
- Likes / Reactions (broken down by type where available)
- Comments (count + content)
- Shares / Reposts
- Impressions (total views)
- Reach (unique viewers)
- Engagement rate (interactions / impressions)
- Click-through rate (where available)
- Saves / Bookmarks (where available)

## [FEAT:BROWSE] — Browser Automation for Any Platform
**Files:** [F:CMD.05], [F:CONFIG.03], [F:SKILL.04]
**Variables:** [V:MCP_PLAYWRIGHT]

## [FEAT:REPURPOSE] — Transform Content Across Platforms
**Description:** Take content from one format/platform and adapt it for another.
**Files:** [F:CMD.06], [F:SKILL.01], [F:SKILL.02], [F:TMPL.01]-[F:TMPL.04]
**Variables:** [V:MCP_GENERATE_IMAGE] (optional)

## [FEAT:AUDIT] — Social Media Profile Audit
**Files:** [F:CMD.07], [F:CONFIG.03]
**Variables:** [V:MCP_PLAYWRIGHT]

## [FEAT:INDEX] — Index Integrity Checking
**Files:** [F:CMD.08], [F:SCRIPT.01], [F:DOC.01]-[F:DOC.04]
**Variables:** (none)
