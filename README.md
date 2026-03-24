# 10x Social Media

AI-powered social media management using Claude Code + Postiz + Playwright.

## Quick Start

1. **Start Docker services:**
   ```bash
   docker compose up -d
   ```

2. **Open Postiz dashboard:**
   Visit `http://localhost:4200`, create your account.

3. **Get your API key:**
   Settings > Developers > Public API — copy the key.

4. **Set the API key in `.env`:**
   Replace `REPLACE_AFTER_FIRST_LOGIN` with your actual key.

5. **Restart the MCP container:**
   ```bash
   docker compose restart postiz-mcp
   ```

6. **Connect your social accounts:**
   In Postiz dashboard, add LinkedIn, Twitter, etc.

7. **Use Claude Code:**
   ```
   /post Write a LinkedIn post about AI productivity tools
   /analytics Show my last 5 posts performance
   /schedule Post this to Twitter tomorrow at 9am
   ```

## Supported Platforms

LinkedIn, Twitter/X, Facebook, Instagram, TikTok, YouTube, Reddit, Pinterest, Threads, Bluesky, Mastodon, Discord, Dribbble

## Architecture

See `docs/ARCHITECTURE.md` for the full system diagram.
