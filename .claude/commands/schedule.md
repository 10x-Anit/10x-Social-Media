# /schedule — Schedule a drafted post for future delivery
<!-- [F:CMD.03] -->
<!-- Depends: [F:CONFIG.04], [F:SKILL.03], [V:POSTIZ_API_KEY] -->
<!-- MCP: [V:MCP_SCHEDULE_POST] -->
<!-- Feature: [FEAT:SCHEDULE] -->

You are scheduling a post for future delivery.

## Steps

1. **Get** the post content (from user input, clipboard, or ask)
2. **Read** skills/content-calendar.md for optimal posting times
3. **Read** config/linkedin-channels.json for integration IDs
4. **Ask** user for:
   - Target platform(s)
   - Date and time (suggest optimal based on calendar)
5. **Call** Postiz MCP `schedulePostTool` with the scheduled datetime
6. **Confirm** the scheduled post details

## User input: $ARGUMENTS

## Important
- Date must be ISO 8601 format for the MCP tool
- Suggest times from content-calendar.md but let user override
- LinkedIn API has NO native scheduling — Postiz handles timing server-side
