# /index-check — Validate index integrity
<!-- [F:CMD.08] -->
<!-- Depends: [F:DOC.01]-[F:DOC.04] -->
<!-- Feature: [FEAT:INDEX] -->

You are validating that all index cross-references resolve correctly.

## Steps

1. **Read** docs/INDEX.md — check every file path exists
2. **Read** docs/VARIABLES.md — check every consumer file exists
3. **Read** docs/DEPENDENCIES.md — check all referenced IDs exist in INDEX.md
4. **Read** docs/FEATURES.md — check all referenced file IDs exist in INDEX.md
5. **Grep** for orphaned IDs: `[F:`, `[V:`, `[FEAT:` across all files
6. **Report** any:
   - Files listed in INDEX.md that don't exist on disk
   - Files on disk not listed in INDEX.md
   - Variable IDs referenced but not defined in VARIABLES.md
   - Feature IDs referenced but not defined in FEATURES.md
   - Broken dependency chains

## Output Format
```
Index Validation Report
═══════════════════════
Files in index:    XX
Files on disk:     XX
Variables defined: XX
Features defined:  XX

Issues found: X
- [ISSUE] description
```

## User input: $ARGUMENTS
