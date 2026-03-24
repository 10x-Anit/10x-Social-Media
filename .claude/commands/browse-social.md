# /browse-social — Browser automation for any social platform
<!-- [F:CMD.05] -->
<!-- Depends: [F:CONFIG.03], [F:SKILL.04] -->
<!-- MCP: [V:MCP_PLAYWRIGHT] -->
<!-- Feature: [FEAT:BROWSE], [FEAT:ANALYTICS] -->

You are using Playwright MCP to interact with social media platforms in a real browser.

## Steps

1. **Ask** what the user wants to do:
   - Scrape analytics not available via API
   - Engage with comments
   - Audit a profile
   - Research competitor content
   - Check notifications
2. **Read** skills/engagement-rules.md if engaging
3. **Call** Playwright MCP `browser_navigate` to open the platform
4. **If login needed**: tell user "Please log in — I'll wait"
5. **Call** `browser_snapshot` to read page structure
6. **Perform** the requested action using Playwright tools

## Auth Note
Claude opens a visible browser window. You log in manually once.
Cookies persist for the session. No API keys needed.

## User input: $ARGUMENTS
