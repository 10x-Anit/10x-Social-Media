# 10x Social Media — OpenCode Chat Plugin

Chat bot plugin that connects Telegram, Slack, Discord, and WhatsApp
to the 10x Social Media platform. Team members message the bot to
create posts, schedule content, and check analytics.

## Quick Start

```bash
cd opencode-plugin
npm install
cp .env.example .env
# Edit .env with your Postiz API key + channel credentials
npm run dev
```

## Architecture

```
Chat Platform (Telegram/Slack/Discord/WhatsApp)
    ↓ Message: "post about AI tools on LinkedIn"
Channel Adapter (implements ChatChannel interface)
    ↓ ChatMessage { userId, text, channelName }
Command Parser
    ↓ { type: "post", platform: "linkedin", content: "..." }
Postiz Client (HTTP)
    ↓ POST /api/public/v1/posts
Postiz App → Temporal Cloud → LinkedIn API
    ↓ Published
Bot replies: "✅ Posted to LinkedIn"
```

## Supported Commands

| Command | Example |
|---------|---------|
| Post | `post AI is changing marketing on LinkedIn` |
| Schedule | `schedule product update for tomorrow 9am` |
| Analytics | `analytics` |
| List accounts | `accounts` |
| Select account | `use company LinkedIn` |
| List posts | `posts` |
| Help | `help` |

## Channel Setup

### Telegram
1. Message @BotFather on Telegram → `/newbot`
2. Copy the token → set `TELEGRAM_BOT_TOKEN` in `.env`

### Slack
1. Go to api.slack.com/apps → Create New App
2. Enable Socket Mode
3. Add Bot Token Scopes: `chat:write`, `app_mentions:read`
4. Install to workspace
5. Copy Bot Token (`xoxb-...`) → `SLACK_BOT_TOKEN`
6. Create App-Level Token → `SLACK_APP_TOKEN`

### Discord
1. Go to discord.com/developers → New Application → Bot
2. Enable Message Content Intent
3. Copy Bot Token → `DISCORD_CHAT_BOT_TOKEN`
4. Invite bot to server with message permissions

### WhatsApp
1. Set `WHATSAPP_ENABLED=true` in `.env`
2. Run `npm run dev`
3. Scan QR code with WhatsApp on first run
4. Auth persists — no re-scan needed

## Multi-Account

When a user has multiple accounts for one platform:

```
User: accounts
Bot:  Connected accounts:
      1. linkedin — "John's Profile" (active)
      2. linkedin — "Acme Corp" (active)
      3. twitter — "@acme_official" (active)

User: use Acme Corp
Bot:  Selected: Acme Corp (linkedin)

User: Just launched our new AI feature!
Bot:  ✅ Posted to Acme Corp (linkedin)
```

## Connecting to Remote Postiz

Set `POSTIZ_BASE_URL` in `.env` to your server:
```
POSTIZ_BASE_URL=https://social.yourdomain.com
```
