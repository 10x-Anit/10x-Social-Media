# /setup — Complete automated setup for new user
<!-- [F:CMD.10] -->
<!-- Features: ALL -->

You are the installer. The user just cloned this repo and you need to build
their entire local system from scratch. They should NOT manually edit any files.
You ask questions, they answer, you create everything.

## IMPORTANT BEHAVIOR
- Ask ONE question at a time, wait for answer
- Create files yourself — never tell the user to edit files manually
- If something fails, diagnose and fix it — don't dump errors
- Remember: the user may not be technical at all

## Phase 1: Prerequisites Check

### 1.1 Docker
```bash
docker --version
```
- If NOT installed → "You need Docker Desktop installed first.
  Download it from https://docker.com/products/docker-desktop
  Install it, start it, then run /setup again."
- If installed but not running → "Docker is installed but not running.
  Please start Docker Desktop and run /setup again."
- If running → continue

### 1.2 Node.js
```bash
node --version
```
- If NOT installed → "You need Node.js installed.
  Download it from https://nodejs.org (LTS version).
  Install it, then run /setup again."
- If installed → continue

## Phase 2: Create .env File

### 2.1 Check if .env exists
- If .env already exists → "I found an existing .env file. Want to
  reconfigure from scratch or keep your current settings?"
- If .env does NOT exist → copy from config/.env.example

### 2.2 Generate JWT Secret
- Automatically generate: `openssl rand -base64 32`
- Write to .env as JWT_SECRET — don't ask the user for this

### 2.3 Ask for Temporal Cloud credentials
```
Do you have a Temporal Cloud account?

Temporal Cloud handles reliable scheduling — it makes sure your
scheduled posts go out even if your computer restarts.

→ If YES: "Please go to cloud.temporal.io and give me:
   1. Your namespace name (looks like: prod.xxxxx or something.xxxxx)
   2. Your API key (generate one in Settings → API Keys)"

→ If NO: "You can sign up at cloud.temporal.io — they give you
   $1,000 in free credits to start. Want to continue without
   scheduling for now?" (If yes, leave TEMPORAL vars as placeholders)
```

Write to .env:
- TEMPORAL_ADDRESS=<namespace>.tmprl.cloud:7233
- TEMPORAL_NAMESPACE=<namespace>
- TEMPORAL_API_KEY=<their key>

### 2.4 Set base URLs
Ask: "Will you use this locally or on a server?"
- If LOCAL (default): set POSTIZ_BASE_URL=http://localhost:4200
- If SERVER: ask for domain, set accordingly

### 2.5 Write the complete .env
Read config/.env.example as template, fill in all values, write to .env.
Leave social media platform keys empty — those get filled via Postiz dashboard.

## Phase 3: Start Docker Services

### 3.1 Start the stack
```bash
cd "<project directory>"
docker compose up -d
```
- Show progress: "Starting Postiz platform... this may take a few minutes
  on first run (downloading container images)."
- Wait for containers to be healthy
- Check: `docker ps` — verify postiz-app, postiz-postgres, postiz-redis

### 3.2 Wait for backend
- Wait 30 seconds for Postiz backend to initialize
- Check backend logs for "Backend is running on: http://localhost:3000"
- If NOT starting → check logs, diagnose, and fix
  (common issue: Temporal connection — if fails, suggest skipping Temporal
  for now and using self-hosted Temporal as fallback)

### 3.3 Verify
- Confirm Postiz is accessible at the configured URL
- "The platform is running at http://localhost:4200"

## Phase 4: Postiz Account Setup

### 4.1 Create account
```
Now let's create your account:

1. Open http://localhost:4200 in your browser
2. You'll see a registration page
3. Enter your email, password, and company name
4. Click "Create Account"

Tell me when you've created your account.
```

### 4.2 Get API Key
```
Great! Now let's get your API key:

1. In the Postiz dashboard, click on Settings (gear icon)
2. Go to "Developers" section
3. You'll see your Public API key
4. Copy it and paste it here
```
- When they paste it: write to .env as POSTIZ_API_KEY
- Restart postiz container to pick up new env: `docker compose restart postiz`
- Verify by running: `POSTIZ_API_KEY=<key> npx postiz integrations:list`
- "API key is working."

## Phase 5: Connect Social Media Accounts

### 5.1 Platform selection
```
Which social media platforms do you want to connect?

Postiz supports all of these:
 • LinkedIn (personal profile or company page)
 • Twitter / X
 • Facebook (page)
 • Instagram (business account)
 • TikTok
 • YouTube
 • Reddit
 • Pinterest
 • Threads
 • Bluesky
 • Mastodon
 • Discord
 • Dribbble

Tell me which ones you want to set up.
```

### 5.2 Developer credentials guidance
For each platform the user selects, explain:
```
To connect {{platform}}, you'll need developer credentials.
Here's how to get them:

{{platform-specific instructions}}

Once you have the Client ID and Client Secret, paste them here.
```

Write each credential pair to .env and restart Postiz.

### 5.3 LinkedIn-specific
```
LinkedIn Developer Setup:
1. Go to linkedin.com/developers → Create App
2. App name: anything (e.g., "My Social Manager")
3. Company: select your LinkedIn company page
4. In "Auth" tab, add this redirect URL:
   http://localhost:4200/integrations/social/linkedin
5. In "Products" tab, request:
   - Share on LinkedIn
   - Sign In with LinkedIn using OpenID Connect
6. Copy Client ID and Client Secret, paste them here.
```

### 5.4 Connect via dashboard
After credentials are in .env and Postiz is restarted:
```
Now connect your account:
1. Open http://localhost:4200
2. Go to Channels → Add Channel → {{platform}}
3. Click Connect — you'll be redirected to log in
4. Authorize the app
5. Tell me when done
```

### 5.5 Verify connections
- Run `postiz integrations:list` to confirm
- Show user their connected accounts with friendly names
- Sync to config/linkedin-channels.json

### 5.6 Multiple accounts
```
Do you want to connect additional accounts for {{platform}}?
For example, both a personal profile AND a company page?
You can connect as many as you need.
```

## Phase 6: Personalize

### 6.1 Voice and tone
```
Let's set up your posting style so I write content that sounds like you.

1. What industry are you in?
2. Describe your brand tone in a few words (professional, casual, witty, bold...)
3. Any words or phrases you ALWAYS want to use?
4. Any words or phrases you NEVER want to use?
5. What topics do you mainly post about?
```
- Update skills/social-voice.md with their answers (or create a personal override)

### 6.2 Posting schedule
```
What's your ideal posting schedule?
- Which days do you typically post?
- What times work best? (e.g., "Tuesday and Thursday mornings")
- How many posts per week?
```
- Update skills/content-calendar.md with their preferences

## Phase 7: Test Run

### 7.1 Test draft
```
Let's test everything with a quick draft.
Give me a topic and I'll create a post for you.
(This is just a draft — I won't publish anything.)
```
- Create a draft using their voice rules and connected platform
- Show the preview
- If they like it, offer to publish or schedule

### 7.2 Test analytics (if posts exist)
- If they have existing posts on connected platforms:
  ```
  Want me to pull analytics for your recent posts?
  I can check how they're performing.
  ```

## Phase 8: Mobile Access (Remote Control)

### 8.1 Claude Mobile App
```
Want to control this from your phone?

Claude Remote Control lets you use the Claude mobile app to
run all these commands from anywhere.

To enable:
1. Run this in your terminal: claude remote-control
   (or type /remote-control inside Claude Code)
2. A QR code will appear — scan it with the Claude mobile app
3. Once connected, you can send /post, /schedule, /analytics
   right from your phone

Works on iOS and Android.
```

### 8.2 Chat Bot Access (OpenCode Plugin)
```
You can also interact via Telegram, Slack, Discord, or WhatsApp.

The chat bot runs separately — to set it up:
1. cd opencode-plugin
2. npm install
3. cp .env.example .env
4. Edit .env with your Postiz API key + channel credentials
5. npm run dev

See opencode-plugin/README.md for channel-specific setup.
```

## Phase 9: Summary

```
✅ Setup Complete!

Your system:
  Dashboard:   http://localhost:4200
  Temporal:    {{namespace}} (cloud scheduling)
  Accounts:    {{list all connected accounts}}
  Mobile:      Claude Remote Control (scan QR to pair)
  Chat bot:    opencode-plugin/ (Telegram/Slack/Discord/WhatsApp)

What you can do now:

  /post            Write and publish a post
  /draft           Draft without publishing
  /schedule        Schedule posts for the future
  /analytics       Check post performance
  /track-analytics Capture detailed metrics over time
  /browse-social   Open any site in browser
  /repurpose       Adapt content across platforms
  /audit           Check your profile completeness

  Mobile:      claude remote-control (pair with phone)
  Chat bot:    cd opencode-plugin && npm run dev
  Dashboard:   http://localhost:4200

Say /post to create your first post!
```

## User input: $ARGUMENTS
