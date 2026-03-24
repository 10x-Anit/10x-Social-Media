import type { CommandIntent } from "./types.js";

const PLATFORM_ALIASES: Record<string, string> = {
  li: "linkedin", linkedin: "linkedin", ln: "linkedin",
  x: "twitter", twitter: "twitter", tw: "twitter",
  fb: "facebook", facebook: "facebook",
  ig: "instagram", instagram: "instagram", insta: "instagram",
  tt: "tiktok", tiktok: "tiktok",
  yt: "youtube", youtube: "youtube",
  reddit: "reddit",
  pinterest: "pinterest", pin: "pinterest",
  threads: "threads",
  bluesky: "bluesky", bsky: "bluesky",
  mastodon: "mastodon",
  discord: "discord",
  dribbble: "dribbble",
};

function normalizePlatform(text: string): string | undefined {
  const lower = text.toLowerCase().trim();
  return PLATFORM_ALIASES[lower];
}

function extractPlatform(text: string): { platform?: string; remaining: string } {
  const words = text.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    // Check "on linkedin", "to twitter", "for instagram"
    if (["on", "to", "for"].includes(words[i]?.toLowerCase()) && words[i + 1]) {
      const platform = normalizePlatform(words[i + 1]);
      if (platform) {
        const remaining = [...words.slice(0, i), ...words.slice(i + 2)].join(" ");
        return { platform, remaining };
      }
    }
    // Check bare platform name
    const platform = normalizePlatform(words[i]);
    if (platform) {
      const remaining = [...words.slice(0, i), ...words.slice(i + 1)].join(" ");
      return { platform, remaining };
    }
  }
  return { remaining: text };
}

function extractDate(text: string): { date?: string; remaining: string } {
  const datePatterns = [
    /(?:for|at|on)\s+(tomorrow|today)\s*(?:at\s*)?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?/i,
    /(?:for|at|on)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*(?:at\s*)?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?/i,
    /(?:for|at|on)\s+(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2})?)/i,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const remaining = text.replace(match[0], "").trim();
      return { date: match[0].replace(/^(?:for|at|on)\s+/i, "").trim(), remaining };
    }
  }
  return { remaining: text };
}

export function parseCommand(text: string): CommandIntent {
  const lower = text.toLowerCase().trim();

  // Help
  if (/^(help|commands|what can you do|\?)$/i.test(lower)) {
    return { type: "help" };
  }

  // List integrations
  if (/^(accounts|integrations|channels|list accounts|show accounts|connected|my accounts)/i.test(lower)) {
    return { type: "list_integrations" };
  }

  // List posts
  if (/^(posts|list posts|show posts|my posts|recent posts)/i.test(lower)) {
    return { type: "list_posts" };
  }

  // Select account
  const selectMatch = lower.match(/^(?:use|switch to|select)\s+(.+)/i);
  if (selectMatch) {
    return { type: "select_account", account: selectMatch[1] };
  }

  // Analytics
  if (/^(analytics|stats|metrics|performance|how did|how is|how are|engagement)/i.test(lower)) {
    const { platform } = extractPlatform(text);
    return { type: "analytics", platform };
  }

  // Schedule
  if (/^schedule\b/i.test(lower) || /\b(schedule|scheduled)\b/i.test(lower)) {
    const { platform, remaining: r1 } = extractPlatform(text);
    const { date, remaining: r2 } = extractDate(r1);
    const content = r2.replace(/^schedule\s*/i, "").trim() || undefined;
    return { type: "schedule", platform, content, date };
  }

  // Post (explicit)
  if (/^(post|publish|share|tweet|create post)\b/i.test(lower)) {
    const { platform, remaining } = extractPlatform(text);
    const content = remaining.replace(/^(?:post|publish|share|tweet|create post)\s*/i, "").trim() || undefined;
    return { type: "post", platform, content };
  }

  // Post (implicit — anything that looks like content)
  if (text.length > 20) {
    const { platform, remaining } = extractPlatform(text);
    return { type: "post", platform, content: remaining || text };
  }

  return { type: "unknown", raw: text };
}

export const HELP_TEXT = `
*10x Social Media Bot*

*Commands:*
• \`post <content> on <platform>\` — Create and publish a post
• \`schedule <content> for <date>\` — Schedule a post
• \`analytics\` — Check post performance
• \`accounts\` — List connected social media accounts
• \`posts\` — List recent posts
• \`use <account name>\` — Select which account to post to
• \`help\` — Show this message

*Examples:*
• \`post AI is transforming marketing on LinkedIn\`
• \`schedule product launch post for tomorrow at 9am\`
• \`analytics\`
• \`use company LinkedIn\`

*Supported platforms:*
LinkedIn, Twitter/X, Facebook, Instagram, TikTok, YouTube,
Reddit, Pinterest, Threads, Bluesky, Mastodon, Discord, Dribbble
`.trim();
