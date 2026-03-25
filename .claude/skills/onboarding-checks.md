# Onboarding Checks — Run Before Any Command
<!-- [F:SKILL.07] Onboarding pre-flight checks -->
<!-- Read by: ALL commands -->
<!-- Features: ALL -->

## Pre-Flight Check

Before executing ANY slash command, run these checks SILENTLY.
If anything fails, guide the user to fix it — never show raw errors.

### Check 0: System initialized?
```bash
cat .setup-complete 2>/dev/null
```
- If file does NOT exist → "This system hasn't been set up yet. Run /setup first."
  Redirect to /setup. Do NOT proceed with any other command.
- If file exists → continue with checks below

## Check Matrix — Which commands need what

| Check | /post | /draft | /schedule | /analytics | /track | /browse | /repurpose | /audit | /setup |
|-------|-------|--------|-----------|------------|--------|---------|------------|--------|--------|
| Docker running | ABORT | skip | ABORT | ABORT | ABORT | skip | skip | skip | ABORT |
| API key set | ABORT | skip | ABORT | ABORT | ABORT | skip | skip | skip | guide |
| MCP wired | ABORT | skip | ABORT | ABORT | ABORT | skip | skip | skip | guide |
| Accounts exist | ABORT | skip | ABORT | warn | ABORT | skip | skip | skip | guide |
| Target account | ask | skip | ask | skip | skip | skip | ask* | skip | skip |

- **ABORT** = stop command, tell user how to fix
- **warn** = tell user but continue (can show tracker data without accounts)
- **ask** = prompt user to select account
- **skip** = check not needed for this command
- **guide** = part of setup flow, guide through it
- **ask*** = only if publishing the adapted content

## Check 1: Docker Running?
```bash
docker ps | grep postiz-app
```
- If NOT running → "The platform isn't running. Start it with: `docker compose up -d`"
- If running → continue silently

## Check 2: API Key Set?
- Check if POSTIZ_API_KEY is set and not "REPLACE_AFTER_FIRST_LOGIN"
- Also check POSTIZ_API_URL is set (should be http://localhost:4200/api)
- If missing → "Run /setup to configure your credentials."

## Check 2B: MCP Servers Wired?
Read `.mcp.json` and verify:
1. File exists
2. `postiz` server entry has **actual** POSTIZ_API_KEY value (not `${POSTIZ_API_KEY}` or `WILL_BE_SET_DURING_SETUP` or `SETUP_SKIPPED`)
3. `postiz` server entry has **actual** POSTIZ_API_URL value (not a `${VAR}` placeholder)
4. On Windows: commands use `"cmd"` with `["/c", "npx", ...]` args (not bare `"npx"`)

If `.mcp.json` is missing or has placeholders:
→ "MCP servers aren't wired correctly. Run /setup to fix, or I can repair it now."
If user says fix now → read API key from `.env`, detect OS, and rewrite `.mcp.json` with actual values (same logic as setup Phase 4B).

**Why this matters:** Claude Code MCP config does NOT read `.env` files. `${VAR}` placeholders silently fail, causing all Postiz MCP tools to be unavailable.

## Check 3: Accounts Connected?
- Run `postiz integrations:list`
- If empty → "No social accounts connected. Open http://localhost:4200 to add platforms, or run /setup."
- If connected → continue silently

## Check 4: Target Account Selection

When a user has multiple accounts for the same platform:
```
You have {{count}} {{platform}} accounts:
  1. {{name1}} ({{type1}})
  2. {{name2}} ({{type2}})

Which one? (or "all" for all of them)
```

### Account selection persistence
- After user picks an account, remember it for the rest of the session
- If user runs a DIFFERENT platform command, ask again
- If user says "different account" or "switch", clear selection and re-ask
- Store as: selected_account = { platform, integrationId, friendlyName }

## Error Messages — Always Helpful, Never Raw

| Situation | What user sees |
|---|---|
| Docker not running | "Platform services aren't running. Start with: `docker compose up -d`" |
| API key missing | "API key not configured. Run /setup or paste your key from Settings → Developers." |
| API key invalid (401) | "API key isn't working. Get a new one from Postiz dashboard → Settings → Developers." |
| Platform not connected | "{{platform}} isn't connected yet. Open http://localhost:4200 and add it in Channels." |
| Rate limited (429) | "API rate limit reached (30/hour). Try again in a few minutes." |
| Post failed | "Post couldn't be published: {{reason}}. Draft saved so you don't lose your work." |
| Temporal not configured | "Scheduling requires Temporal Cloud. Run /setup to configure, or publish immediately with /post." |
| Composio not configured | "For one-click account connections, set up Composio in /setup. Or connect manually in the dashboard." |
| Network error | "Can't reach the platform. Check if Docker is running: `docker compose up -d`" |
