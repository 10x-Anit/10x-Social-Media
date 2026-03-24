# /setup — First-time setup for a new team member
<!-- [F:CMD.10] -->
<!-- Features: ALL -->

You are onboarding a new team member to the 10x Social Media system. Walk them
through EVERYTHING step by step. Assume they know NOTHING technical.

## When to trigger this
- First time a user runs ANY command and the system isn't configured
- When a user explicitly runs /setup
- When any command fails because of missing credentials or connections

## Step 1: Welcome
```
Welcome to 10x Social Media! 🚀

I'm going to help you set up everything so you can:
• Create and schedule posts to any social media platform
• Track post performance (likes, comments, reach, impressions)
• Repurpose content across platforms
• Get AI-powered content recommendations

This will take about 5-10 minutes. Let's go.
```

## Step 2: Check Docker Services
- Run `docker ps` to check if Postiz, PostgreSQL, Redis are running
- If NOT running:
  ```
  The social media platform needs to be running first.
  Please run this command in your terminal:

  cd "path/to/10x Social Media"
  docker compose up -d

  Then run /setup again.
  ```
- If running, continue

## Step 3: Postiz Account
- Check if user can access http://localhost:4200
- Ask: "Have you created your account on the Postiz dashboard yet?"
  - If NO: "Open http://localhost:4200 in your browser and create an account.
    Use your work email. Tell me when done."
  - If YES: continue

## Step 4: Postiz API Key
- Ask: "Now go to Settings → Developers in the Postiz dashboard.
  Copy your Public API key and paste it here."
- When they paste it:
  - Save to .env as POSTIZ_API_KEY
  - Verify by calling `postiz integrations:list`
  - If it works: "API key is working."
  - If it fails: "That key didn't work. Please double-check and try again."

## Step 5: Connect Social Media Accounts
- Ask: "Which social media platforms do you want to connect?"
- Show the list:
  ```
  Available platforms in Postiz:
  1. LinkedIn (personal profile or company page)
  2. Twitter / X
  3. Facebook (page)
  4. Instagram (business account)
  5. TikTok
  6. YouTube
  7. Reddit
  8. Pinterest
  9. Threads
  10. Bluesky
  11. Mastodon
  12. Discord
  13. Dribbble
  ```
- For each selected platform:
  ```
  To connect {{platform}}:
  1. Open http://localhost:4200 in your browser
  2. Go to the Channels/Integrations section
  3. Click "Add Channel" → select {{platform}}
  4. Follow the OAuth login flow
  5. Tell me when done
  ```
- After connecting, run `postiz integrations:list` to verify
- Show them their connected accounts with names and IDs

## Step 6: Multiple Accounts
- Ask: "Do you manage multiple accounts for any platform?
  For example, a personal LinkedIn AND a company LinkedIn page?"
- If YES:
  ```
  Great! Connect each account separately in the Postiz dashboard.
  When you use /post, I'll ask which account to post to.
  Your connected accounts:
  - LinkedIn: "John's Profile" (personal)
  - LinkedIn: "Acme Corp" (company page)
  - Instagram: "@acme_official" (business)
  ```

## Step 7: Sync Channels
- Run `scripts/sync-channels.sh` or equivalent to populate config/linkedin-channels.json
- Confirm all integrations are cached

## Step 8: Personalize Voice
- Ask: "Let's set up your posting style. Tell me about your brand voice:
  1. What industry are you in?
  2. How would you describe your tone? (professional, casual, witty, etc.)
  3. Any words or phrases you always/never use?
  4. What topics do you mainly post about?"
- Based on answers, offer to customize skills/social-voice.md
  or create a personal voice file

## Step 9: Test Post
- Offer: "Want to create a test draft to make sure everything works?"
- If YES: run through /draft flow with their first platform
- Show the result but DON'T publish

## Step 10: Summary
```
Setup complete! Here's what you can do:

Commands:
  /post          — Write and publish a post
  /draft         — Draft without publishing
  /schedule      — Schedule a post for later
  /analytics     — See how your posts are performing
  /track-analytics — Capture detailed metrics over time
  /browse-social — Open any platform in the browser
  /repurpose     — Adapt content for different platforms
  /audit         — Check your profile completeness

Your connected accounts:
  {{list accounts}}

Tips:
  • I'll always show you the draft before publishing
  • Say "post to [account name]" to target specific accounts
  • Ask me "how did my last post do?" anytime
  • I'll remember your voice and style preferences

Ready to create your first post? Just say /post!
```

## User input: $ARGUMENTS
