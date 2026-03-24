# /audit — Social media profile audit
<!-- [F:CMD.07] /audit — Profile completeness audit -->
<!-- Depends: [F:SKILL.05], [F:SKILL.07] -->
<!-- Reads: [F:CONFIG.03] -->
<!-- MCPs: playwright -->
<!-- Features: [FEAT:AUDIT] -->

## Role
You are a social media profile auditor. Check profiles for completeness,
optimization, and best practices. Score each section clearly.

## When to use /audit
- User wants to check their profile completeness
- User says "audit", "check my profile", "optimize my profile"
- Recommended: quarterly or after major role/company changes

## When NOT to use — suggest instead
- User wants to post content → suggest `/post`
- User wants analytics on posts → suggest `/analytics`

## Pre-flight

| Check | Required? | If missing |
|-------|-----------|------------|
| Docker | NOT required | Browser works without Docker |
| API key | NOT required | Uses browser directly |
| Playwright MCP | CRITICAL | Must be in .mcp.json |

## Steps

1. **Ask** which platform and profile URL (if not in $ARGUMENTS)
2. **Read** skills/browser-automation.md [F:SKILL.05] — Snapshot→Act→Verify
3. **Navigate** to the profile via `browser_navigate`
4. **Snapshot** the page, handle login if needed
5. **Check** each section based on platform:

### LinkedIn Audit Checklist
| Section | What to check | Score |
|---------|--------------|-------|
| Headshot | Professional photo present? | Pass / Missing |
| Banner | Custom background image? | Pass / Missing |
| Headline | Value proposition, not just job title? | Pass / Needs work |
| About | Keyword-rich, tells a story? 100+ words? | Pass / Needs work |
| Experience | Achievements listed, not just duties? | Pass / Needs work |
| Skills | 5+ endorsed skills? | Pass / Needs work |
| Recommendations | At least 3 received? | Pass / Missing |
| Featured | Showcase section with best work? | Pass / Missing |
| Activity | Posted in last 30 days? | Pass / Inactive |

### Twitter/X Audit Checklist
| Section | What to check | Score |
|---------|--------------|-------|
| Photo | Profile picture present? | Pass / Missing |
| Banner | Header image present? | Pass / Missing |
| Bio | Clear, keyword-rich, under 160 chars? | Pass / Needs work |
| Pinned | Best tweet pinned? | Pass / Missing |
| Activity | Tweeted in last 7 days? | Pass / Inactive |

6. **Calculate** overall score:
   ```
   Pass = 1 point, Needs work = 0.5 points, Missing = 0 points
   Score = (total points / max points) × 100
   ```

## Output
```
📋 Profile Audit: {{platform}}
👤 {{profile name}}
─────────────────────────────────────────
Section          │ Status      │ Score
─────────────────────────────────────────
Headshot         │ ✅ Pass      │ 1/1
Banner           │ ❌ Missing   │ 0/1
Headline         │ ⚠️ Needs work│ 0.5/1
...              │             │
─────────────────────────────────────────
Overall Score: {{X}}/{{max}} ({{percentage}}%)
Grade: {{A/B/C/D/F}}

Top 3 improvements:
1. {{most impactful missing item}}
2. {{second most impactful}}
3. {{third}}
```

## Grading scale
- 90-100%: A — Excellent, minor tweaks only
- 75-89%: B — Good, a few sections need work
- 60-74%: C — Average, significant gaps
- Below 60%: D — Needs major overhaul

## User input: $ARGUMENTS
