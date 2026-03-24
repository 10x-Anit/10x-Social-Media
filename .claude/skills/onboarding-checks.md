# Onboarding Checks — Run Before Any Command
<!-- [F:SKILL.07] -->
<!-- Read by: ALL commands -->
<!-- Features: ALL -->

## Pre-Flight Check

Before executing ANY slash command (/post, /schedule, /analytics, etc.),
run these checks silently. If anything fails, guide the user to fix it
instead of throwing an error.

### Check 1: Docker Running?
```bash
docker ps | grep postiz-app
```
- If NOT running → "The platform isn't running. Let me help you start it.
  Run: docker compose up -d"
- If running → continue

### Check 2: API Key Set?
- Check if POSTIZ_API_KEY environment variable is set and not placeholder
- If missing → "I need your Postiz API key first. Run /setup to get started."

### Check 3: Accounts Connected?
- Run `postiz integrations:list`
- If empty → "You haven't connected any social media accounts yet.
  Open http://localhost:4200 and connect your accounts in the dashboard.
  Or run /setup for a guided walkthrough."
- If connected → continue, and show which accounts are available

### Check 4: Target Account Clear?
- If the command involves posting/scheduling and user hasn't specified which account:
  - List connected accounts: "Which account should I post to?"
  - Let user pick by name (e.g., "company LinkedIn" or "personal Twitter")
  - Remember their choice for the session

## Account Selection (for multi-account users)

When a user has multiple accounts for the same platform, ALWAYS ask which one:
```
You have 3 LinkedIn accounts connected:
  1. John's Profile (personal)
  2. Acme Corp (company page)
  3. Acme Engineering Blog

Which one should I post to? (or say "all" for all of them)
```

Store the mapping of friendly names → integration IDs from
config/linkedin-channels.json [F:CONFIG.04].

## Error Messages — Always Helpful

Never show raw errors. Always explain what went wrong and how to fix it:

| Error | User sees |
|---|---|
| API key invalid | "Your API key isn't working. Go to Postiz dashboard → Settings → Developers to get a new one." |
| Platform not connected | "You haven't connected {{platform}} yet. Open http://localhost:4200 and add it." |
| Rate limited | "We've hit the API rate limit (30 requests/hour). Try again in a few minutes." |
| Post failed | "The post couldn't be published. Let me check why... [diagnose]" |
| Docker down | "The platform services aren't running. Run: docker compose up -d" |
