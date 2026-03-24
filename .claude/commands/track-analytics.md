# /track-analytics — Capture and record post metrics over time
<!-- [F:CMD.09] /track-analytics — Capture and record analytics -->
<!-- Depends: [F:SKILL.05], [F:SKILL.06], [F:SKILL.07] -->
<!-- Reads: [F:DATA.01], [F:CONFIG.04] -->
<!-- MCPs: postiz, playwright -->
<!-- Features: [FEAT:ANALYTICS] -->

## Role
You are a data capture assistant. Your job is to pull metrics from platforms
and record them in the analytics tracker for trend analysis over time.

## When to use /track-analytics
- User wants to capture a snapshot of current metrics
- User says "track", "capture", "record analytics", "update metrics"
- Automated/scheduled metric collection

## When NOT to use — suggest instead
- User just wants to SEE analytics → suggest `/analytics`
- User wants to see the dashboard → suggest opening localhost:4200

## Pre-flight

| Check | Required? | If missing |
|-------|-----------|------------|
| Docker running | CRITICAL | Needed for Postiz API |
| POSTIZ_API_KEY | CRITICAL | Needed for API calls |
| Accounts connected | CRITICAL | No accounts = no posts to track |

## Steps

1. **Read** data/analytics-tracker.json [F:DATA.01]
2. **Read** skills/analytics-tracking.md [F:SKILL.06] for schema
3. **Read** skills/browser-automation.md [F:SKILL.05] for Playwright approach
4. **Ask** what to track (if not clear from $ARGUMENTS):
   - "Capture all recent posts" → scan last 10 posts
   - "Track this post" → user gives URL or description
   - "Update existing" → re-capture metrics for tracked posts
   - "Analyze" → run analysis on stored data (no capture)

5. **For "capture all recent posts":**
   a. Call `postiz posts:list` to get recent posts
   b. For each post (newest first, max 10):
      - Check if already in tracker → skip if snapshot <24h old
      - Pull metrics via API first, Playwright fallback
      - Calculate `hours_since_publish = (now - published_at) / 3600`
      - Create snapshot entry
   c. Report: "Captured X posts, skipped Y (already recent)"

6. **For "track this post":**
   a. Find post by URL, ID, or content search
   b. Navigate to platform analytics (via Playwright if needed)
   c. Extract all available metrics
   d. Create or update entry in tracker

7. **Recording a snapshot:**
   ```json
   {
     "captured_at": "{{ISO-8601 now}}",
     "source": "postiz-api|playwright|manual",
     "hours_since_publish": {{calculated}},
     "metrics": {
       "impressions": {{number or null}},
       "reach": {{number or null}},
       "likes": {{number or null}},
       "comments": {{number or null}},
       "shares": {{number or null}},
       "saves": {{number or null}},
       "clicks": {{number or null}},
       "engagement_rate": {{calculated or null}}
     }
   }
   ```

8. **Update** summary block in tracker (totals, averages, best performing)
9. **Write** updated JSON back to data/analytics-tracker.json

## Hours since publish — how to calculate
```
published_at = post.published_at (from Postiz)
captured_at = now
hours = (captured_at - published_at) / 3600
Round to nearest whole number for display:
  0-1 hours → "Hour 0"
  1-12 hours → "Hour X"
  12-36 hours → "Day 1"
  36-180 hours → "Day X"
  180+ hours → "Week X"
```

## Output
```
📊 Analytics Captured
─────────────────────────────────────────
Tracked: {{count}} posts
Updated: {{count}} existing entries
Skipped: {{count}} (snapshots <24h old)
─────────────────────────────────────────
{{For each captured post:}}
  "{{title}}" ({{platform}}) — {{impressions}} impr, {{likes}} likes, {{engagement_rate}}%
```

## Rate limit handling
- Postiz API: max 30 req/hr. Track batch size accordingly.
- Playwright: max 10 page loads per session. Warn if batch exceeds.
- If rate limit hit: stop, save what we have, tell user to continue later.

## User input: $ARGUMENTS
