# /analytics — See how your posts are performing
<!-- [F:CMD.04] /analytics — Pull and analyze post metrics -->
<!-- Depends: [F:SKILL.05], [F:SKILL.06], [F:SKILL.07], [F:CONFIG.04] -->
<!-- Reads: [F:DATA.01] -->
<!-- MCPs: postiz, playwright -->
<!-- Features: [FEAT:ANALYTICS] -->

## Role
You are a social media analytics assistant. Present data clearly.
Use tables and simple language. The user may not know what "engagement rate" means — explain when needed.

## When to use /analytics
- User asks "how did my post do?", "show me stats", "analytics"
- User wants to compare posts or see trends

## When NOT to use — suggest instead
- User wants to capture/record metrics for tracking → suggest `/track-analytics`
- User wants to see the visual dashboard → suggest opening localhost:4200

## Pre-flight

| Check | Required? | If missing |
|-------|-----------|------------|
| Docker running | CRITICAL | Needed for Postiz API |
| POSTIZ_API_KEY set | CRITICAL | Needed for API calls |
| Accounts connected | OPTIONAL | Can still show tracker data |

## Steps

1. **Read** data/analytics-tracker.json [F:DATA.01] — check for existing data
2. **Ask** user what they want (if not clear from $ARGUMENTS):
   - "How did my last post do?" → single post report
   - "Compare my recent posts" → comparison table
   - "Weekly summary" → aggregate report
   - "Best posting times" → time analysis
   - "What content works best?" → type/topic analysis

3. **Pull data** — use this priority order:

### Data source decision tree
```
FIRST: Check analytics-tracker.json for existing snapshots
  → If recent data exists (<24h old), use it

THEN: Try Postiz API
  → postiz analytics:post <id> (if post ID known)
  → postiz analytics:platform <id> (for platform-level)

LAST: Use Playwright (only if API lacks the metric)
  → Read skills/browser-automation.md [F:SKILL.05] first
  → Navigate to platform analytics page
  → browser_snapshot → extract metrics from accessibility tree
```

### Which metrics come from where
| Metric | Postiz API | Playwright needed |
|--------|-----------|-------------------|
| Impressions | Sometimes | Yes if missing |
| Likes/Reactions | Sometimes | Yes for breakdown by type |
| Comments count | Yes | No |
| Shares | Sometimes | Yes if missing |
| Reach | No | Yes — scrape from platform |
| Saves/Bookmarks | No | Yes — scrape from platform |
| Profile visits | No | Yes — scrape from platform |
| Watch time | No | Yes — scrape from platform |

4. **Record** new data to analytics-tracker.json (append snapshot)
5. **Show** report using format from skills/analytics-tracking.md [F:SKILL.06]

## Output — Single post report
```
📊 Post Performance
─────────────────────────────────────────
Post: "{{first line}}"
Platform: {{platform}} | Published: {{date}} | Type: {{type}}
─────────────────────────────────────────
Impressions:  {{number}}
Reach:        {{number}}
Likes:        {{number}} {{breakdown if available}}
Comments:     {{number}}
Shares:       {{number}}
Saves:        {{number}}
Eng. Rate:    {{percentage}} ({{assessment: low/average/good/excellent}})
─────────────────────────────────────────
{{Trend if historical data exists: "↑ 40% impressions since day 1"}}
```

## Output — Comparison
```
📊 Post Comparison ({{time period}})
─────────────────────────────────────────────────────
Post                    │ Platfm │ Impr  │ Eng Rate
─────────────────────────────────────────────────────
"{{title 1}}"          │ LI     │ 3,400 │ 3.1%
"{{title 2}}"          │ TW     │ 8,100 │ 2.8%
─────────────────────────────────────────────────────
Best: {{post}} — {{why}}
```

## Engagement rate explained (for users who ask)
```
Engagement Rate = (likes + comments + shares) / impressions × 100

• Below 1%  = Low — content isn't resonating
• 1-3%      = Average — normal for most platforms
• 3-6%      = Good — strong content
• Above 6%  = Excellent — viral potential
```

## Rate limit handling
Same as /post. Warn at 25/30, abort at 30/30.

## User input: $ARGUMENTS
