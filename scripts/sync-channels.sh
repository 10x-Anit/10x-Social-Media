#!/bin/bash
# [F:SCRIPT.02] Pull current integrations from Postiz API
# Depends: [V:POSTIZ_API_KEY], [V:POSTIZ_BASE_URL]
# Writes: [F:CONFIG.04] config/linkedin-channels.json
# Features: [FEAT:ANALYTICS]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load env
if [ -f "$PROJECT_DIR/.env" ]; then
  export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
fi

if [ -z "$POSTIZ_API_KEY" ] || [ "$POSTIZ_API_KEY" = "REPLACE_AFTER_FIRST_LOGIN" ]; then
  echo "Error: POSTIZ_API_KEY not set. Get it from Postiz Dashboard > Settings > Developers"
  exit 1
fi

BASE_URL="${POSTIZ_BASE_URL:-http://localhost:4200}"
API_URL="$BASE_URL/api/public/v1/integrations"

echo "Fetching integrations from $API_URL ..."

RESPONSE=$(curl -s -H "Authorization: Bearer $POSTIZ_API_KEY" "$API_URL")

if echo "$RESPONSE" | python3 -m json.tool >/dev/null 2>&1; then
  echo "$RESPONSE" | python3 -m json.tool > "$PROJECT_DIR/config/linkedin-channels.json"
  echo "Saved to config/linkedin-channels.json"
  echo ""
  echo "Connected platforms:"
  echo "$RESPONSE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if isinstance(data, list):
    for i in data:
        print(f\"  - {i.get('platform', '?')}: {i.get('name', '?')} (ID: {i.get('id', '?')})\")
else:
    print('  Unexpected response format')
"
else
  echo "Error: Invalid response from API"
  echo "$RESPONSE"
  exit 1
fi
