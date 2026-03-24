# /analytics — Pull per-post performance metrics
<!-- [F:CMD.04] -->
<!-- Depends: [F:CONFIG.04], [F:SKILL.05], [F:SKILL.06], [F:DATA.01], [V:POSTIZ_API_KEY] -->
<!-- MCP: [V:MCP_INTEGRATION_LIST], [V:MCP_PLAYWRIGHT] -->
<!-- Feature: [FEAT:ANALYTICS] -->

You are pulling and analyzing social media analytics.

## Steps

1. **Read** skills/analytics-tracking.md [F:SKILL.06] for metrics and methods
2. **Read** data/analytics-tracker.json [F:DATA.01] for historical data
3. **Ask** user what they want:
   - **"How did my last post do?"** → single post report
   - **"Compare my recent posts"** → comparison table
   - **"Weekly summary"** → aggregate report
   - **"Best posting times"** → time analysis
   - **"What content works best?"** → type/topic analysis
   - **"Track this post"** → capture + record (hands off to /track-analytics)
4. **Pull data** — layered approach:
   a. Check tracker file for existing snapshots
   b. Try Postiz CLI: `postiz analytics:post <id>` or `postiz analytics:platform <id>`
   c. If deeper metrics needed → Playwright (read skills/browser-automation.md [F:SKILL.05]):
      - `browser_navigate` → platform analytics page
      - `browser_snapshot` → read accessibility tree
      - Extract: likes, comments, shares, impressions, reach, saves
5. **Record** new data to tracker (append snapshot, update summary)
6. **Show historical trend** if previous snapshots exist for this post
7. **Format** results using report templates from analytics-tracking.md

## Per-Post Metrics

| Metric | Description |
|--------|-------------|
| Impressions | Total times post was displayed |
| Reach | Unique people who saw it |
| Likes/Reactions | Total + breakdown by type |
| Comments | Count |
| Shares/Reposts | Total redistributions |
| Saves/Bookmarks | People who saved for later |
| Clicks | Link or content clicks |
| Engagement Rate | (likes+comments+shares) / impressions |
| Profile Visits | People who visited profile after seeing post |

## Output — Single Post
```
Post: "{{first line of post}}"
Platform: {{platform}} | Published: {{date}} | Type: {{type}}
──────────────────────────
Impressions:  {{number}}
Reach:        {{number}}
Likes:        {{number}}
Comments:     {{number}}
Shares:       {{number}}
Saves:        {{number}}
Eng. Rate:    {{percentage}}
──────────────────────────
Trend: ↑ impressions grew 40% since day 1
```

## User input: $ARGUMENTS
