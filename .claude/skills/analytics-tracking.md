# Analytics Tracking System
<!-- [F:SKILL.06] -->
<!-- Read by: [F:CMD.04], [F:CMD.09] -->
<!-- Features: [FEAT:ANALYTICS] -->

## Tracker File

All analytics data is stored in `data/analytics-tracker.json` [F:DATA.01].
This file is the single source of truth for post performance over time.

## What We Track Per Post

| Metric | LinkedIn | Twitter/X | Facebook | Instagram | TikTok | YouTube |
|---|---|---|---|---|---|---|
| Impressions | Yes | Yes | Yes | Yes | Yes (views) | Yes |
| Reach | Yes | — | Yes | Yes | — | — |
| Likes/Reactions | By type | Yes | By type | Yes | Yes | Yes |
| Comments | Yes | Yes | Yes | Yes | Yes | Yes |
| Shares/Reposts | Yes | Retweets | Yes | — | Yes | — |
| Saves/Bookmarks | — | Yes | Yes | Yes | Yes | — |
| Clicks | Yes | Yes | Yes | — | — | Yes |
| Engagement Rate | Calc | Calc | Calc | Calc | Calc | Calc |
| Profile Visits | Yes | Yes | — | Yes | Yes | — |
| Watch Time | — | — | — | — | Yes | Yes |
| Video Views | — | — | Yes | Yes | Yes | Yes |

## When to Capture Snapshots

| Timing | Hours After Publish | Why |
|---|---|---|
| Immediately | 0 | Baseline |
| Early momentum | 3 | Algorithm signal |
| Day 1 | 24 | Critical for reach |
| Day 7 | 168 | Medium-term |
| Day 30 | 720 | Long-tail |
| On-demand | varies | User requests /analytics |

## How to Capture

### Path 1: Postiz API (structured, limited)
```
postiz analytics:post <post_id>
```
Returns whatever Postiz tracks. Record as `source: "postiz-api"`.

### Path 2: Playwright (richest data)
1. Read browser-automation.md [F:SKILL.05] first
2. Navigate to the post URL or platform analytics page
3. `browser_snapshot` → extract metrics from accessibility tree
4. Record as `source: "playwright"`

### Path 3: Manual
User tells Claude a metric → record as `source: "manual"`.

## Recording Data

1. Read `data/analytics-tracker.json`
2. Find the post (match by `url` or `postiz_id`)
3. If not found, create a new post entry
4. Append a new snapshot to the post's `snapshots` array
5. Calculate `engagement_rate`: `(likes + comments + shares) / impressions`
6. Update the `summary` block
7. Write back the JSON

## Engagement Rate Formula

```
engagement_rate = (likes + comments + shares) / impressions
```

Platform-specific adjustments:
- **LinkedIn**: all reaction types count as "likes"
- **Twitter**: retweets + quote tweets = "shares"
- **Instagram**: include saves in numerator
- **If impressions = 0 or null**: engagement_rate = null

## Analysis Patterns

When user asks for analysis, use these approaches:

### Compare Posts
Sort all posts by engagement_rate, impressions, or any metric. Show top/bottom.

### Best Posting Times
Group posts by `published_at` day-of-week and hour. Calculate average
engagement per time slot. Recommend best times.

### Content Type Analysis
Group by `content_type` (text, carousel, poll, video, article, image).
Calculate average metrics per type. Show which format works best.

### Topic Pillar Analysis
Group by `topic_pillar` (educational, personal, engagement, promotional, curated).
Show which topics drive most engagement.

### Growth Curves
Compare snapshots at same `hours_since_publish` across posts.
Which post gained traction fastest?

### Trend Over Time
Are overall account metrics growing or declining week-over-week?

## Report Formats

### Single Post Report
```
Post: "{{preview}}"
Platform: {{platform}} | Published: {{date}} | Type: {{type}}
─────────────────────────────────────────────
         Hour 0    Day 1     Day 7     Day 30
Impress  120       1,200     3,400     5,100
Reach    90        890       2,100     3,200
Likes    5         45        78        92
Comments 1         12        18        21
Shares   0         5         8         10
Eng Rate 5.0%      5.2%      3.1%      2.4%
─────────────────────────────────────────────
```

### Weekly Summary
```
Week of {{date}}
═══════════════════════════════════
Posts published: 5
Total impressions: 12,400
Total engagement: 340 interactions
Avg engagement rate: 4.2% (↑ 0.8% vs last week)

Best post: "{{preview}}" — 6.1% engagement
Worst post: "{{preview}}" — 1.8% engagement

Top content type: carousel (5.4% avg)
Top topic: educational (4.8% avg)
Best time: Tuesday 9am (5.2% avg)
═══════════════════════════════════
```
