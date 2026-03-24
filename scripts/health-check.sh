#!/bin/bash
# [F:SCRIPT.03] Verify MCP connections, env vars, Docker services
# Features: ALL

set -e

echo "═══════════════════════════════════════"
echo "  10x Social Media — Health Check"
echo "═══════════════════════════════════════"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Check .env exists
echo ""
echo "1. Environment File"
if [ -f "$PROJECT_DIR/.env" ]; then
  echo "   [OK] .env exists"
else
  echo "   [FAIL] .env not found — copy from config/.env.example"
fi

# Check required vars
echo ""
echo "2. Required Variables"
for var in POSTIZ_BASE_URL JWT_SECRET POSTIZ_API_KEY; do
  val=$(grep "^$var=" "$PROJECT_DIR/.env" 2>/dev/null | cut -d= -f2-)
  if [ -z "$val" ] || [ "$val" = "CHANGE_ME" ] || [ "$val" = "REPLACE_AFTER_FIRST_LOGIN" ] || [ "$val" = "CHANGE_ME_GENERATE_A_RANDOM_STRING_HERE" ]; then
    echo "   [WARN] $var not set or using placeholder"
  else
    echo "   [OK] $var is configured"
  fi
done

# Check Docker
echo ""
echo "3. Docker Services"
if command -v docker &>/dev/null; then
  echo "   [OK] Docker found"
  for svc in postiz-app postiz-postgres postiz-redis postiz-temporal postiz-mcp; do
    status=$(docker inspect -f '{{.State.Status}}' "$svc" 2>/dev/null || echo "not found")
    if [ "$status" = "running" ]; then
      echo "   [OK] $svc is running"
    else
      echo "   [WARN] $svc — $status"
    fi
  done
else
  echo "   [FAIL] Docker not found"
fi

# Check MCP endpoints
echo ""
echo "4. MCP Endpoints"
MCP_URL=$(grep "POSTIZ_MCP_URL" "$PROJECT_DIR/.env" 2>/dev/null | cut -d= -f2-)
if [ -n "$MCP_URL" ]; then
  if curl -s --max-time 5 "$MCP_URL" >/dev/null 2>&1; then
    echo "   [OK] Postiz MCP reachable at $MCP_URL"
  else
    echo "   [WARN] Postiz MCP not reachable at $MCP_URL"
  fi
else
  echo "   [WARN] POSTIZ_MCP_URL not set"
fi

# Check .mcp.json
echo ""
echo "5. Claude Code MCP Config"
if [ -f "$PROJECT_DIR/.mcp.json" ]; then
  echo "   [OK] .mcp.json exists"
else
  echo "   [FAIL] .mcp.json not found"
fi

echo ""
echo "═══════════════════════════════════════"
echo "  Health check complete"
echo "═══════════════════════════════════════"
