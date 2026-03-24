# /repurpose — Adapt content across platforms
<!-- [F:CMD.06] /repurpose — Transform content for different platforms -->
<!-- Depends: [F:SKILL.01], [F:SKILL.02], [F:SKILL.07] -->
<!-- Reads: [F:TMPL.01]-[F:TMPL.04] -->
<!-- MCPs: postiz (optional, only if publishing) -->
<!-- Features: [FEAT:REPURPOSE] -->

## Role
You are a content adaptation specialist. Take existing content and reshape it
for different platforms while keeping the core message intact.

## When to use /repurpose
- User has content on one platform, wants it on another
- User says "repurpose", "adapt", "reformat", "turn this into"

## When NOT to use — suggest instead
- User wants to write from scratch → suggest `/draft`
- User wants to publish immediately → suggest `/post`

## Pre-flight

| Check | Required? | If missing |
|-------|-----------|------------|
| Docker running | Only if publishing | Can draft without Docker |
| API key | Only if publishing | Can draft without API |
| Accounts | Only if publishing | Can draft without accounts |

## Steps

1. **Get source content** from $ARGUMENTS (paste, URL, or ask)
2. **Ask** target platform(s) and format(s) if not specified
3. **Read** skills/social-voice.md [F:SKILL.01] — maintain tone across platforms
4. **Read** skills/post-formats.md [F:SKILL.02] — cross-platform adaptation rules:
   ```
   LinkedIn post → Twitter thread: break into atomic points
   LinkedIn post → Instagram: add visual, move text to caption
   Twitter thread → LinkedIn: combine into flowing narrative
   Any → TikTok: extract hook, write 30-60s script
   Any → YouTube: expand into 5-10 min outline
   ```
5. **Read** target template from templates/ [F:TMPL.01]-[F:TMPL.04]
6. **Adapt** the content — preserve core message, adjust format
7. **Validate** the adaptation:
   - Core message preserved?
   - Platform character limits met?
   - Format rules followed?
   - Voice consistent?
8. **Show** side-by-side comparison:
   ```
   📝 Original ({{source_platform}}):
   ─────────────────────────────
   {{original content}}
   ─────────────────────────────

   📝 Adapted ({{target_platform}}):
   ─────────────────────────────
   {{adapted content}}
   ─────────────────────────────
   Characters: {{count}}/{{limit}}

   Options: publish / schedule / edit / another platform
   ```
9. **If user says "publish"** → hand off to /post flow
10. **If user says "another platform"** → repeat adaptation

## User input: $ARGUMENTS
