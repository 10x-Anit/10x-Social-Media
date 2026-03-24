# API Reference
<!-- [F:DOC.05] Postiz API + MCP tools quick reference -->

## Postiz MCP Tools (8 tools)

### integrationList [V:MCP_INTEGRATION_LIST]
Lists all connected social media accounts.
```
No parameters required.
Returns: Array of { id, platform, name, status }
```

### integrationSchema [V:MCP_INTEGRATION_SCHEMA]
Get the post schema for a specific platform.
```
Parameters:
  platform: string (e.g., "linkedin", "twitter", "facebook")
  isPremium: boolean
Returns: Schema describing required/optional post fields
```

### schedulePostTool [V:MCP_SCHEDULE_POST]
Create and schedule a post to one or more platforms.
```
Parameters:
  socialPost: Array of {
    integrationId: string    // from integrationList
    content: string          // HTML: <p>, <strong>, <u>, <ul>, <ol>, <li>, <h1>-<h6>
    date: string             // ISO 8601 datetime
    media: Array of { url }  // optional
  }
Returns: { postId, status, scheduledDate }
```

### triggerTool [V:MCP_TRIGGER_TOOL]
Trigger platform-specific actions.
```
Parameters:
  integrationId: string
  methodName: string
Returns: varies by method
```

### generateImageTool [V:MCP_GENERATE_IMAGE]
Generate images for posts.
```
Parameters:
  prompt: string    // image description
Returns: { url }
```

### generateVideoOptions [V:MCP_GENERATE_VIDEO_OPTS]
List available video generation options.
```
No parameters.
Returns: Array of video generation configs
```

### videoFunctionTool [V:MCP_VIDEO_FUNCTION]
Execute video functions.
```
Parameters:
  identifier: string
  functionName: string
Returns: varies
```

### generateVideoTool [V:MCP_GENERATE_VIDEO]
Generate video content.
```
Parameters:
  identifier: string
  output: string
  customParams: object
Returns: { url }
```

## Postiz Public REST API (3 endpoints)

### GET /api/public/v1/integrations [V:EP_INTEGRATIONS]
```
Auth: Bearer {POSTIZ_API_KEY}
Rate: 30 req/hr
Returns: All connected social accounts with IDs
```

### POST /api/public/v1/posts [V:EP_POSTS]
```
Auth: Bearer {POSTIZ_API_KEY}
Rate: 30 req/hr
Body: { integrationId, content, date, media[] }
Returns: Created post with ID
```

### POST /api/public/v1/upload [V:EP_UPLOAD]
```
Auth: Bearer {POSTIZ_API_KEY}
Rate: 30 req/hr
Body: multipart/form-data with file
Returns: { url } for use in post media
```

## Playwright MCP Tools [V:MCP_PLAYWRIGHT]

| Tool | Purpose |
|------|---------|
| browser_navigate | Open a URL |
| browser_snapshot | Get accessibility tree |
| browser_click | Click an element |
| browser_fill | Fill a form field |
| browser_screenshot | Take screenshot |
| browser_evaluate | Run JavaScript |
| browser_select_option | Select dropdown option |
| browser_press_key | Press keyboard key |

## Per-Post Analytics Data Points

When pulling analytics via API or Playwright, these are the metrics available per platform:

| Metric | LinkedIn | Twitter/X | Facebook | Instagram | TikTok | YouTube |
|--------|----------|-----------|----------|-----------|--------|---------|
| Likes/Reactions | Yes (by type) | Yes | Yes (by type) | Yes | Yes | Yes |
| Comments | Yes | Yes | Yes | Yes | Yes | Yes |
| Shares/Reposts | Yes | Yes (retweets) | Yes | — | Yes | — |
| Impressions | Yes | Yes | Yes | Yes | Yes | Yes |
| Reach | Yes | — | Yes | Yes | — | — |
| Saves | — | Yes (bookmarks) | Yes | Yes | Yes | — |
| Click-through | Yes | Yes | Yes | — | — | Yes |
| Engagement Rate | Calculated | Calculated | Calculated | Calculated | Calculated | Calculated |
| Watch Time | — | — | — | — | Yes | Yes |
| Profile Visits | Yes | Yes | — | Yes | Yes | — |
