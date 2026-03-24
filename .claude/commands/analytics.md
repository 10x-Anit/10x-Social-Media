# /analytics — Pull per-post performance metrics
<!-- [F:CMD.04] -->
<!-- Depends: [F:CONFIG.04], [V:POSTIZ_API_KEY], [V:EP_INTEGRATIONS] -->
<!-- MCP: [V:MCP_INTEGRATION_LIST], [V:MCP_PLAYWRIGHT] (fallback) -->
<!-- Feature: [FEAT:ANALYTICS] -->

You are pulling social media analytics for the user.

## Steps

1. **Call** Postiz MCP `integrationList` to get all connected platforms
2. **Ask** user what they want:
   - All posts summary (last 7/30 days)
   - Specific post metrics
   - Platform comparison
   - Engagement trends
3. **Pull data** via Postiz API: GET /api/public/v1/integrations [V:EP_INTEGRATIONS]
4. **If deeper metrics needed** (per-post reactions, reach, impressions not in API):
   - Use Playwright MCP to open platform analytics page
   - `browser_navigate` → platform analytics URL
   - `browser_snapshot` → read the accessibility tree
   - Extract: likes, comments, shares, impressions, reach, saves
5. **Format** results as a clean table

## Per-Post Metrics to Track

| Metric | Description |
|--------|-------------|
| Likes/Reactions | Total + breakdown by type |
| Comments | Count + notable comments |
| Shares/Reposts | Total redistributions |
| Impressions | Total times post was displayed |
| Reach | Unique people who saw it |
| Engagement Rate | (likes+comments+shares) / impressions |
| Click-through | Link clicks (if applicable) |
| Saves/Bookmarks | People who saved for later |

## User input: $ARGUMENTS

## Output Format
```
Post: "{{post_title_or_first_line}}"
Platform: {{platform}}
Published: {{date}}
──────────────────────────
Impressions:  {{number}}
Reach:        {{number}}
Likes:        {{number}}
Comments:     {{number}}
Shares:       {{number}}
Saves:        {{number}}
Eng. Rate:    {{percentage}}
──────────────────────────
```
