# Browser Automation — Intelligent Playwright Playbook
<!-- [F:SKILL.05] -->
<!-- Read by: [F:CMD.04], [F:CMD.05], [F:CMD.07] -->
<!-- Features: [FEAT:BROWSE], [FEAT:ANALYTICS], [FEAT:AUDIT] -->

## Core Rule: NEVER use CSS selectors or XPath.

Always use `browser_snapshot` to read the accessibility tree. Identify elements
by their **role**, **name**, and **text content**. The accessibility tree is
stable across UI redesigns because platforms maintain ARIA roles.

## The Loop: Snapshot → Act → Verify

Every interaction follows this pattern:

```
1. browser_snapshot → read the page structure
2. Find target element by role + name (e.g., button "Post", textbox "Write a comment")
3. browser_click / browser_fill_form / browser_type using the element's ref
4. browser_snapshot → verify the action worked
5. If unexpected result → scroll, wait, re-snapshot, or try alternative
```

## Element Identification

| Looking for | Search for in snapshot |
|---|---|
| Buttons | `role: button` with matching name |
| Links | `role: link` with matching text |
| Text inputs | `role: textbox` or `role: searchbox` |
| Dropdowns | `role: combobox`, `role: listbox` |
| Menu items | `role: menu`, `role: menuitem` |
| Tabs | `role: tab`, `role: tablist` |
| Dialogs/modals | `role: dialog`, `role: alertdialog` |
| Posts/cards | `role: article` or `role: listitem` |
| Navigation | `role: navigation` |
| Metrics/stats | Text nodes near labels like "Impressions", "Likes" |

When exact name is unclear, search for **partial text matches** in the snapshot.

## Login Detection

After `browser_navigate`, take a `browser_snapshot`:
- If snapshot contains `textbox "Email"` + `button "Sign in"` → login needed
- Tell user: "Please log in in the browser window. Tell me when done."
- After user confirms → `browser_snapshot` again to verify authenticated state
- Cookies persist for the session

## Cookie Consent / Popups

- Look for `role: dialog` with buttons like "Accept", "Accept all", "Got it"
- Click the accept button to dismiss
- Re-snapshot after dismissal

## Scrolling & Infinite Pages

```
1. browser_press_key "End" or "PageDown" to scroll
2. browser_snapshot → see newly loaded content
3. Repeat until target found (max 10 scrolls)
4. For "Load more" buttons → click them instead
```

## Extracting Data from Pages

Metrics appear as text nodes near their labels in the accessibility tree:
```
"Impressions" → next text node → "1,234"
"Likes" → next text node → "45"
```

- Parse numbers by stripping commas: "1,234" → 1234
- For tables: look for `role: table`, `role: row`, `role: cell`
- For charts: data may not be in accessibility tree → use `browser_evaluate`
  to read JavaScript variables, or `browser_take_screenshot` and describe

## Platform Analytics URLs

| Platform | Analytics Page |
|---|---|
| LinkedIn | Post URL → "View analytics" link, or `linkedin.com/analytics/` |
| Twitter/X | Post URL → engagement count, or `analytics.twitter.com` |
| Facebook | `business.facebook.com/insights/` or post → "View insights" |
| Instagram | Post → "View insights" (Business/Creator accounts only) |
| YouTube | `studio.youtube.com` → Analytics tab |
| TikTok | `tiktok.com/analytics` or video → analytics |

## Error Recovery

| Problem | Solution |
|---|---|
| Click failed | Re-snapshot (refs change after page updates), retry |
| Modal/overlay blocking | Find close button (name: "Close", "X", "Dismiss") |
| Rate limited / CAPTCHA | Wait 30s with `browser_wait_for`, then retry |
| Page structure unexpected | `browser_take_screenshot`, describe to user |
| Element not found | Scroll down, re-snapshot, look again |

## Safety Rules

- **NEVER** click "Post" / "Publish" / "Send" without user approval
- **NEVER** click "Delete" on any content
- **NEVER** change account settings
- **NEVER** submit forms automatically
- When engaging (commenting/liking), confirm with user first
- Follow engagement-rules.md [F:SKILL.04] for comment quality
- Maximum 10 page loads per session to avoid rate limits
- Wait 3+ seconds between actions on same platform
