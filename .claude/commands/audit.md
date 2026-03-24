# /audit — Social media profile audit
<!-- [F:CMD.07] -->
<!-- Depends: [F:CONFIG.03] -->
<!-- MCP: [V:MCP_PLAYWRIGHT] -->
<!-- Feature: [FEAT:AUDIT] -->

You are auditing a social media profile for completeness and optimization.

## Steps

1. **Ask** which platform and profile URL (or use connected accounts)
2. **Call** Playwright MCP `browser_navigate` to open the profile
3. **Call** `browser_snapshot` to read profile structure
4. **Check** each section:

### LinkedIn Audit
- [ ] Professional headshot
- [ ] Background banner
- [ ] Headline (not just job title — value proposition)
- [ ] About section (keyword-rich, tells a story)
- [ ] Experience (detailed, with achievements)
- [ ] Skills (endorsed, relevant)
- [ ] Recommendations (given and received)
- [ ] Featured section (showcase best work)
- [ ] Activity (regular posting)

### Twitter/X Audit
- [ ] Profile photo
- [ ] Banner image
- [ ] Bio (clear, keyword-rich)
- [ ] Pinned tweet (best content)
- [ ] Posting consistency

### General Audit Points
- [ ] Consistent branding across platforms
- [ ] Links working
- [ ] Contact info accessible
- [ ] Content mix (not all self-promotion)

5. **Score** each section (complete / needs work / missing)
6. **Provide** specific recommendations

## User input: $ARGUMENTS
