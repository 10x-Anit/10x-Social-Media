#!/usr/bin/env bash
# [F:SCRIPT.03] Verify MCP connections, env vars, Docker services
# Features: ALL
# Works on: Windows (Git Bash/WSL), macOS, Linux

set -e

echo "═══════════════════════════════════════"
echo "  10x Social Media — Health Check"
echo "═══════════════════════════════════════"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Detect compose command
if docker compose version &>/dev/null; then
  COMPOSE="docker compose"
elif docker-compose version &>/dev/null; then
  COMPOSE="docker-compose"
else
  COMPOSE=""
fi

# 1. Check .env exists
echo ""
echo "1. Environment File"
if [ -f "$PROJECT_DIR/.env" ]; then
  echo "   [OK] .env exists"
else
  echo "   [FAIL] .env not found — run /setup in Claude Code"
fi

# 2. Check required vars
echo ""
echo "2. Required Variables"
for var in POSTIZ_BASE_URL POSTIZ_API_URL JWT_SECRET POSTIZ_API_KEY TEMPORAL_ADDRESS; do
  val=$(grep "^$var=" "$PROJECT_DIR/.env" 2>/dev/null | cut -d= -f2- || true)
  if [ -z "$val" ] || echo "$val" | grep -qE "CHANGE_ME|REPLACE|WILL_BE"; then
    echo "   [WARN] $var not set or using placeholder"
  else
    echo "   [OK] $var is configured"
  fi
done

# 3. Check Docker
echo ""
echo "3. Docker Services"
if command -v docker &>/dev/null; then
  echo "   [OK] Docker found ($COMPOSE)"
  for svc in postiz-app postiz-postgres postiz-redis; do
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

# 4. Check Node.js
echo ""
echo "4. Node.js"
if command -v node &>/dev/null; then
  echo "   [OK] Node.js $(node --version)"
else
  echo "   [FAIL] Node.js not found — install from https://nodejs.org"
fi

# 5. Check MCP config
echo ""
echo "5. MCP Config"
if [ -f "$PROJECT_DIR/.mcp.json" ]; then
  echo "   [OK] .mcp.json exists"
  for server in postiz composio playwright; do
    if grep -q "\"$server\"" "$PROJECT_DIR/.mcp.json" 2>/dev/null; then
      echo "   [OK] $server MCP registered"
    else
      echo "   [WARN] $server MCP not found in .mcp.json"
    fi
  done

  # Check for unresolved ${VAR} placeholders (Claude Code cannot resolve these)
  if grep -qE '\$\{[A-Z_]+\}' "$PROJECT_DIR/.mcp.json" 2>/dev/null; then
    echo "   [FAIL] .mcp.json contains \${VAR} placeholders — Claude Code cannot resolve these"
    echo "         Run /setup to wire actual values into .mcp.json"
  else
    echo "   [OK] No unresolved placeholders"
  fi

  # Check for SETUP_SKIPPED or WILL_BE markers
  if grep -qE 'SETUP_SKIPPED|WILL_BE' "$PROJECT_DIR/.mcp.json" 2>/dev/null; then
    echo "   [WARN] Some MCP keys still need configuration — run /setup"
  fi

  # Check Windows cmd /c wrapper (only on Windows)
  case "$(uname -s 2>/dev/null)" in
    MINGW*|MSYS*|CYGWIN*)
      if grep -q '"npx"' "$PROJECT_DIR/.mcp.json" 2>/dev/null && ! grep -q '"cmd"' "$PROJECT_DIR/.mcp.json" 2>/dev/null; then
        echo "   [FAIL] Windows detected but .mcp.json uses bare 'npx' — needs 'cmd /c' wrapper"
        echo "         Run /setup to fix"
      else
        echo "   [OK] Windows cmd /c wrapper present"
      fi
      ;;
  esac
else
  echo "   [FAIL] .mcp.json not found — run /setup"
fi

# 6. Check OpenAnalyst plugin
echo ""
echo "6. OpenAnalyst Plugin"
if [ -f "$PROJECT_DIR/openanalyst-plugin/package.json" ]; then
  if [ -d "$PROJECT_DIR/openanalyst-plugin/node_modules" ]; then
    echo "   [OK] Plugin installed"
  else
    echo "   [WARN] Plugin not installed — run: cd openanalyst-plugin && npm install"
  fi
  if [ -d "$PROJECT_DIR/openanalyst-plugin/dist" ]; then
    echo "   [OK] Plugin built"
  else
    echo "   [WARN] Plugin not built — run: cd openanalyst-plugin && npm run build"
  fi
else
  echo "   [WARN] OpenAnalyst plugin not found"
fi

echo ""
echo "═══════════════════════════════════════"
echo "  Health check complete"
echo "═══════════════════════════════════════"
