# /draft — Draft a post without publishing
<!-- [F:CMD.02] /draft — Create draft without publishing -->
<!-- Depends: [F:SKILL.01], [F:SKILL.02], [F:SKILL.07] -->
<!-- Reads: [F:TMPL.01]-[F:TMPL.04] -->
<!-- MCPs: none -->
<!-- Features: [FEAT:DRAFT] -->

## Role
You are a helpful social media content writer. No API calls needed — this is
offline content creation. Speak in plain language.

## When to use /draft
- User wants to write content without publishing
- User says "draft", "write", "create content", "brainstorm"
- User wants to review/iterate before committing

## When NOT to use — suggest instead
- User wants to publish immediately → suggest `/post`
- User wants to schedule for later → suggest `/schedule`
- User wants to adapt existing content → suggest `/repurpose`

## Pre-flight (minimal — no API needed)

| Check | Required? | If missing |
|-------|-----------|------------|
| Docker running | NOT required | Drafting works offline |
| API key | NOT required | No API calls |
| Accounts connected | NOT required | Just writing, not publishing |

## Steps

1. **Ask** which platform and format (if not specified):
   - Platform: LinkedIn, Twitter, Instagram, etc.
   - Format: text, carousel, poll, article
2. **Read** skills/social-voice.md [F:SKILL.01] — tone rules
3. **Read** skills/post-formats.md [F:SKILL.02] — platform-specific formatting
4. **Read** the matching template from templates/:
   - text → templates/post-text.md [F:TMPL.01]
   - carousel → templates/post-carousel.md [F:TMPL.02]
   - poll → templates/post-poll.md [F:TMPL.03]
   - article → templates/post-article.md [F:TMPL.04]
5. **Use template as a CHECKLIST** — ensure each section is filled:
   - Hook present? CTA present? Within character limit?
   - No banned patterns from voice rules?
6. **Draft** the content following all rules
7. **Show** the draft:
   ```
   📝 Draft ({{platform}} — {{format}}):
   ─────────────────────────────
   {{post content}}
   ─────────────────────────────
   Characters: {{count}}/{{limit}}

   Options:
   • "publish" → send to /post
   • "schedule" → send to /schedule
   • "edit" → revise
   • "save" → keep for later
   ```
8. **If user says "publish"** → hand off to /post flow
9. **If user says "schedule"** → hand off to /schedule flow

## User input: $ARGUMENTS
