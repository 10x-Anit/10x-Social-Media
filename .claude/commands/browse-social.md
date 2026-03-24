# /browse-social — Browser automation for any social platform
<!-- [F:CMD.05] -->
<!-- Depends: [F:CONFIG.03], [F:SKILL.04], [F:SKILL.05] -->
<!-- MCP: [V:MCP_PLAYWRIGHT] -->
<!-- Feature: [FEAT:BROWSE], [FEAT:ANALYTICS] -->

You are using Playwright MCP to interact with social media platforms in a real browser.

## IMPORTANT: Read skills/browser-automation.md [F:SKILL.05] FIRST.

That skill teaches you the Snapshot → Act → Verify loop for ANY page. Never
hardcode selectors. Always use accessibility tree snapshots to understand page
structure dynamically.

## Steps

1. **Read** skills/browser-automation.md [F:SKILL.05] — the Playwright playbook
2. **Ask** what the user wants to do:
   - Scrape analytics not available via API
   - Engage with comments
   - Audit a profile
   - Research competitor content
   - Check notifications
   - Any other browser task on any website
3. **Read** skills/engagement-rules.md [F:SKILL.04] if engaging
4. **Call** `browser_navigate` to open the target URL
5. **Call** `browser_snapshot` to read the page accessibility tree
6. **Handle obstacles:**
   - Login wall → tell user to log in manually, wait, re-snapshot
   - Cookie consent → find and click accept button
   - Popup/modal → find and close it
7. **Identify elements** by role + name from the snapshot (NOT CSS selectors)
8. **Perform** the action using the Snapshot → Act → Verify loop
9. **After each action** → re-snapshot to confirm result

## Works on ANY page
This approach works on any website — social media, analytics dashboards,
competitor sites, news articles, anything. The accessibility tree adapts
to whatever page structure exists.

## Auth Note
Claude opens a visible browser window. You log in manually once.
Cookies persist for the session. No API keys needed.

## User input: $ARGUMENTS
