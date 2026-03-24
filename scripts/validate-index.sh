#!/bin/bash
# [F:SCRIPT.01] Check all index references resolve
# Features: [FEAT:INDEX]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "═══════════════════════════════════════"
echo "  Index Validation"
echo "═══════════════════════════════════════"

ERRORS=0

# Check all file paths in INDEX.md exist
echo ""
echo "Checking file paths in INDEX.md..."
while IFS='|' read -r _ _ path _ _; do
  path=$(echo "$path" | xargs)
  if [ -n "$path" ] && [ "$path" != "Path" ] && [ "$path" != "---" ]; then
    if [ ! -f "$PROJECT_DIR/$path" ]; then
      echo "  [MISSING] $path"
      ERRORS=$((ERRORS + 1))
    fi
  fi
done < <(grep '^\|' "$PROJECT_DIR/docs/INDEX.md" | grep -v '^\| ID' | grep -v '^\|---')

# Check for files not in index
echo ""
echo "Checking for unindexed files..."
find "$PROJECT_DIR" -type f \
  -not -path "*/.git/*" \
  -not -path "*/node_modules/*" \
  -not -name ".DS_Store" \
  -not -name "Thumbs.db" | while read -r file; do
  relpath="${file#$PROJECT_DIR/}"
  if ! grep -q "$relpath" "$PROJECT_DIR/docs/INDEX.md" 2>/dev/null; then
    echo "  [UNINDEXED] $relpath"
  fi
done

echo ""
echo "═══════════════════════════════════════"
echo "  Errors found: $ERRORS"
echo "═══════════════════════════════════════"
