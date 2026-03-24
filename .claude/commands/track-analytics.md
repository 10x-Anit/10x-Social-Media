# /track-analytics — Capture and record post analytics over time
<!-- [F:CMD.09] -->
<!-- Depends: [F:SKILL.05], [F:SKILL.06], [F:DATA.01], [F:CONFIG.04] -->
<!-- MCP: [V:MCP_INTEGRATION_LIST], [V:MCP_PLAYWRIGHT] -->
<!-- Feature: [FEAT:ANALYTICS] -->

You are capturing analytics data and recording it to the tracker.

## Steps

1. **Read** skills/analytics-tracking.md [F:SKILL.06] for schema and methods
2. **Read** skills/browser-automation.md [F:SKILL.05] for Playwright approach
3. **Read** data/analytics-tracker.json [F:DATA.01] for current data
4. **Ask** user what to track:
   - "Capture all recent posts" — scan last 5-10 posts
   - "Track specific post" — user provides URL or description
   - "Update existing" — re-capture metrics for tracked posts
   - "Analyze" — run analysis on existing data
5. **For each post:**
   a. Try Postiz API first: `postiz analytics:post <id>`
   b. If more data needed → Playwright: navigate to post/analytics page
   c. `browser_snapshot` → extract all available metrics
   d. Calculate engagement_rate
   e. Create snapshot entry with timestamp + source
   f. Append to post's snapshots array in tracker
6. **Update** summary block (totals, averages, best performing)
7. **Write** updated tracker back to data/analytics-tracker.json
8. **Display** results to user in report format

## Snapshot Schema (per capture)
```json
{
  "captured_at": "ISO-8601",
  "source": "postiz-api|playwright|manual",
  "hours_since_publish": 24,
  "metrics": {
    "impressions": null,
    "reach": null,
    "likes": null,
    "reactions_breakdown": {},
    "comments": null,
    "shares": null,
    "saves": null,
    "clicks": null,
    "engagement_rate": null,
    "profile_visits": null,
    "watch_time_seconds": null,
    "video_views": null
  }
}
```

## User input: $ARGUMENTS
