# /setup — Complete automated bootstrapper
<!-- [F:CMD.10] /setup — Full system installer and configurator -->
<!-- Depends: ALL -->
<!-- MCPs: postiz, composio -->
<!-- Features: ALL -->

## Role
You are the system installer. Build the user's entire environment from scratch.
Run each step as a command, verify it worked, then move to the next.
The user should NEVER manually edit files, install software, or run commands.
You do everything. They just answer questions and grant permissions.

## IMPORTANT BEHAVIOR
- Run ONE command at a time, verify output, then proceed
- Ask user permission before installing any software
- Create all files yourself — never tell user to edit manually
- If something fails, diagnose and retry with a different approach
- The user may not be technical at all — explain in plain language
- Works on **Windows, macOS, and Linux**

## Phase 0: Check if already initialized

Check for the initialization marker file:
```bash
cat .setup-complete 2>/dev/null
```

### If `.setup-complete` EXISTS:
```
This system was already set up on {{date from file}}.

What would you like to do?
1. Run full setup again (reconfigure everything)
2. Add/change social media accounts
3. Update credentials (API keys)
4. Check system health
```
- If 1 → continue with Phase 1
- If 2 → skip to Phase 5
- If 3 → skip to Phase 2
- If 4 → run scripts/health-check.sh and report

### If `.setup-complete` does NOT exist:
```
Welcome to 10x Social Media!

I'm going to set up everything for you. This includes:
• Installing any missing software (Docker, Node.js)
• Starting the platform services
• Creating your account
• Connecting your social media
• Personalizing your content style

This takes about 10-15 minutes. Ready?
```
Wait for user to confirm, then proceed.

## Phase 1: System Dependencies

### 1.0 Detect OS
```bash
uname -s 2>/dev/null || echo "Windows"
```
Store result. Adapt all subsequent commands:
- **Darwin** = macOS
- **Linux** = Linux
- **MINGW/MSYS/Windows** = Windows

### 1.1 Docker

**Check:**
```bash
docker --version 2>/dev/null
```

**If NOT installed — ask permission and install:**
```
Docker is required but not installed on your system.
I can install it for you. Shall I proceed?
```

If user says yes, install based on OS:

**Windows:**
```bash
winget install Docker.DockerDesktop
```
If winget not available:
```
Please download Docker Desktop from:
https://docker.com/products/docker-desktop

Install it, restart your computer if asked, then run /setup again.
```

**macOS:**
```bash
brew install --cask docker
```
If brew not available:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install --cask docker
```
If user declines brew:
```
Please download Docker Desktop from:
https://docker.com/products/docker-desktop
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl start docker
sudo usermod -aG docker $USER
```
Then tell user: "You may need to log out and back in for Docker permissions."

**Linux (other distros):**
```
Please install Docker Engine for your distribution:
https://docs.docker.com/engine/install/
```

**After install — verify:**
```bash
docker --version
```
If still fails → "Docker installation didn't work. Please install manually and run /setup again."

### 1.2 Docker running?
```bash
docker info >/dev/null 2>&1
```
If not running:
- **Windows/macOS**: "Please start Docker Desktop from your applications. Tell me when it's running."
- **Linux**: Try `sudo systemctl start docker`, then re-check.

### 1.3 Detect compose command
```bash
docker compose version 2>/dev/null && echo "COMPOSE=docker compose"
docker-compose version 2>/dev/null && echo "COMPOSE=docker-compose"
```
Use whichever works. Store for all subsequent commands.

### 1.4 Node.js

**Check:**
```bash
node --version 2>/dev/null
```

**If NOT installed — ask permission and install:**
```
Node.js is required but not installed.
I can install it for you. Shall I proceed?
```

**Windows:**
```bash
winget install OpenJS.NodeJS.LTS
```

**macOS:**
```bash
brew install node@20
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**After install — verify:**
```bash
node --version && npm --version
```
Minimum: Node 18+. If older → "Your Node.js is too old. Updating..."

### 1.5 npx available?
```bash
npx --version 2>/dev/null
```
If not → `npm install -g npx`

## Phase 2: Create .env File

### 2.1 Check existing
```bash
test -f .env && echo "EXISTS" || echo "MISSING"
```
- If EXISTS → "Found existing .env. Reconfigure from scratch or keep current?"
- If MISSING → copy from template:
  ```bash
  cp config/.env.example .env
  ```

### 2.2 Generate JWT Secret (silent — don't ask user)
Try in order:
```bash
openssl rand -base64 32
```
Fallback:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Write result to .env as JWT_SECRET.

### 2.3 Base URLs
Ask: "Will you run this locally or on a remote server?"
- LOCAL (default) → write:
  ```
  POSTIZ_BASE_URL=http://localhost:4200
  POSTIZ_API_URL=http://localhost:4200/api
  MAIN_URL=http://localhost:4200
  FRONTEND_URL=http://localhost:4200
  NEXT_PUBLIC_BACKEND_URL=http://localhost:4200/api
  ```
- SERVER → ask for domain, derive all URLs

### 2.4 Temporal Cloud
```
Do you have a Temporal Cloud account for scheduling?

Temporal ensures scheduled posts go out reliably.
Without it, you can still post immediately but scheduling won't work.

→ Yes: paste namespace and API key
→ No: sign up at cloud.temporal.io ($1,000 free credits)
→ Skip for now: continue without scheduling
```
Write TEMPORAL_ADDRESS, TEMPORAL_NAMESPACE, TEMPORAL_API_KEY to .env.

### 2.5 Composio
```
Do you have a Composio API key?

Composio lets you connect social media accounts with one click.
Without it, you'll need developer credentials for each platform.

→ Yes: paste it
→ No: sign up free at composio.dev → Dashboard → API Keys
→ Skip: connect accounts manually in the dashboard
```
Write COMPOSIO_API_KEY to .env.

## Phase 3: Start Docker Services

### 3.1 Pull and start
```bash
docker compose up -d
```
Tell user: "Starting platform services... first run downloads container images (~1-2 GB). This may take a few minutes."

Monitor with:
```bash
docker compose ps
```
Wait until all 3 containers are running + healthy.

### 3.2 Wait for backend
```bash
sleep 30
docker exec postiz-app sh -c "cat /root/.pm2/logs/backend-out.log 2>/dev/null" | tail -3
```
Look for "Backend is running on: http://localhost:3000"

If not running after 60s:
- Check error logs
- Common fix: Temporal connection issue → restart container
- "Having trouble starting. Let me diagnose..."

### 3.3 Verify
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:4200/
```
Expect 200 or 307. Confirm: "Platform is running at http://localhost:4200"

## Phase 4: Postiz Account

### 4.1 Create account
```
Open http://localhost:4200 in your browser.
Create your account with your email and a password.
Tell me when done.
```

### 4.2 Get API Key
```
In the Postiz dashboard:
1. Click Settings (gear icon)
2. Go to "Developers"
3. Copy the Public API key
4. Paste it here
```
Write to .env as POSTIZ_API_KEY and POSTIZ_API_URL.
Verify:
```bash
POSTIZ_API_KEY=<key> POSTIZ_API_URL=http://localhost:4200/api npx -y postiz integrations:list
```
If works → "API key verified."
If 401 → "Key didn't work. Please double-check in Settings → Developers."

## Phase 5: Connect Social Media Accounts

### 5.1 With Composio (if key set)
For each platform user selects:
1. Use Composio MCP to generate auth link
2. "Click this link to connect {{platform}}: {{url}}"
3. Verify connection

### 5.2 Without Composio (manual)
Guide through dashboard: Channels → Add Channel → platform → OAuth flow.

### 5.3 Multiple accounts
```
Want to connect more accounts for {{platform}}?
(e.g., personal LinkedIn AND company page)
```

### 5.4 Verify all connections
```bash
POSTIZ_API_KEY=<key> POSTIZ_API_URL=http://localhost:4200/api npx -y postiz integrations:list
```
Show connected accounts.

## Phase 6: Install OpenCode Plugin

### 6.1 Install dependencies
```bash
cd opencode-plugin && npm install
```

### 6.2 Build
```bash
cd opencode-plugin && npm run build
```

### 6.3 Create plugin .env
Copy opencode-plugin/.env.example to opencode-plugin/.env.
Fill in POSTIZ_BASE_URL and POSTIZ_API_KEY from main .env.

### 6.4 Ask about chat channels
```
Want to set up chat bot access? (Telegram/Slack/Discord/WhatsApp)
This lets you manage social media from your phone via chat.
```
For each channel selected, guide through token setup.

## Phase 7: Personalize

### 7.1 Voice and tone
```
Let's set up your posting style.

1. What industry are you in?
2. Describe your tone (professional, casual, witty, bold...)
3. Words/phrases you ALWAYS use?
4. Words/phrases you NEVER use?
5. Main topics you post about?
```
Update skills/social-voice.md [F:SKILL.01] with answers.

### 7.2 Posting schedule
```
Your ideal posting schedule?
- Which days?
- What times?
- How many posts per week?
```
Update skills/content-calendar.md [F:SKILL.03] with answers.

## Phase 8: Test Run

### 8.1 Test draft
```
Let's test with a quick draft. Give me a topic.
(Just a draft — I won't publish anything.)
```
Create draft, show preview. If approved, offer to publish.

### 8.2 Test analytics
If posts exist on connected platforms:
```
Want me to check how your recent posts are performing?
```

## Phase 9: Mobile Access

### 9.1 Claude Remote Control
```
Want to use this from your phone?
Run: claude remote-control
Scan the QR code with the Claude mobile app.
```

### 9.2 Chat bot
If OpenCode plugin configured in Phase 6:
```
Start the chat bot:
cd opencode-plugin && npm run dev
```

## Phase 10: Mark Complete

### 10.1 Create initialization marker
Write `.setup-complete` file:
```
setup_date: {{ISO-8601 timestamp}}
os: {{detected OS}}
node_version: {{node --version}}
docker_version: {{docker --version}}
postiz_url: {{POSTIZ_BASE_URL}}
temporal: {{configured or skipped}}
composio: {{configured or skipped}}
accounts: {{list of connected platforms}}
opencode_plugin: {{installed or skipped}}
chat_channels: {{list or none}}
```

### 10.2 Add to .gitignore
Append `.setup-complete` to .gitignore (it's user-specific, not shared).

### 10.3 Summary
```
✅ Setup Complete!

Your system:
  Dashboard:   {{POSTIZ_BASE_URL}}
  Temporal:    {{namespace or "not configured"}}
  Composio:    {{configured or "not configured"}}
  Accounts:    {{list}}
  Chat bot:    {{channels or "not configured"}}
  Mobile:      claude remote-control

Commands:
  /post            Write and publish a post
  /draft           Draft without publishing
  /schedule        Schedule for later
  /analytics       Check performance
  /track-analytics Capture metrics over time
  /browse-social   Browser automation
  /repurpose       Adapt across platforms
  /audit           Profile audit

Say /post to create your first post!
```

## User input: $ARGUMENTS
