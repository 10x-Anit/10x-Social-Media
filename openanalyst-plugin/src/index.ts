import "dotenv/config";
import { PostizClient } from "./postiz-client.js";
import { SessionManager } from "./session-manager.js";
import { parseCommand, HELP_TEXT } from "./command-parser.js";
import type { ChatMessage, ChatChannel, ChannelFactory, PostizIntegration } from "./types.js";

import { createTelegramChannel } from "./channels/telegram/index.js";
import { createSlackChannel } from "./channels/slack/index.js";
import { createDiscordChannel } from "./channels/discord/index.js";
import { createWhatsAppChannel } from "./channels/whatsapp/index.js";

const POSTIZ_BASE_URL = process.env.POSTIZ_BASE_URL || "http://localhost:4200";
const POSTIZ_API_KEY = process.env.POSTIZ_API_KEY;

if (!POSTIZ_API_KEY) {
  console.error("POSTIZ_API_KEY is required. Set it in .env");
  process.exit(1);
}

const client = new PostizClient(POSTIZ_BASE_URL, POSTIZ_API_KEY);
const sessions = new SessionManager();

const factories: ChannelFactory[] = [
  createTelegramChannel,
  createSlackChannel,
  createDiscordChannel,
  createWhatsAppChannel,
];

async function findIntegration(
  integrations: PostizIntegration[],
  platform?: string,
  accountHint?: string
): Promise<PostizIntegration | undefined> {
  let matches = integrations;

  if (platform) {
    matches = matches.filter(
      (i) => i.platform.toLowerCase() === platform.toLowerCase()
    );
  }

  if (accountHint) {
    const hint = accountHint.toLowerCase();
    const fuzzy = matches.filter(
      (i) =>
        i.name.toLowerCase().includes(hint) ||
        i.platform.toLowerCase().includes(hint)
    );
    if (fuzzy.length > 0) matches = fuzzy;
  }

  return matches[0];
}

async function handleMessage(msg: ChatMessage, channel: ChatChannel): Promise<void> {
  const reply = msg.replyTo ?? ((text: string) => channel.send(msg.userId, text));
  const session = sessions.getOrCreate(msg.channelName, msg.userId);
  const intent = parseCommand(msg.text);

  try {
    switch (intent.type) {
      case "help": {
        await reply(HELP_TEXT);
        break;
      }

      case "list_integrations": {
        const integrations = await client.getIntegrations();
        await reply(client.formatIntegrationList(integrations));
        break;
      }

      case "list_posts": {
        await reply(
          "To see your posts, open the Postiz dashboard:\n" +
          `${POSTIZ_BASE_URL}\n\n` +
          "_Post listing via API coming soon._"
        );
        break;
      }

      case "select_account": {
        const integrations = await client.getIntegrations();
        const match = await findIntegration(integrations, undefined, intent.account);
        if (match) {
          sessions.setSelectedAccount(msg.channelName, msg.userId, match.id, match.name);
          await reply(`Selected: *${match.name}* (${match.platform})\n\nNow send me content to post.`);
        } else {
          await reply(
            `Couldn't find an account matching "${intent.account}".\n\n` +
            client.formatIntegrationList(integrations)
          );
        }
        break;
      }

      case "post": {
        const integrations = await client.getIntegrations();
        let target = await findIntegration(integrations, intent.platform, intent.account);

        // Use session default if no platform specified
        if (!target && session.selectedIntegrationId) {
          target = integrations.find((i) => i.id === session.selectedIntegrationId);
        }

        if (!target) {
          const list = client.formatIntegrationList(integrations);
          await reply(
            `Which account should I post to?\n\n${list}\n\n` +
            `Reply: \`use <account name>\` then send your content again.`
          );
          break;
        }

        if (!intent.content) {
          sessions.setSelectedAccount(msg.channelName, msg.userId, target.id, target.name);
          await reply(`Ready to post to *${target.name}* (${target.platform}).\n\nSend me the content.`);
          break;
        }

        // Create post
        const htmlContent = `<p>${intent.content.replace(/\n/g, "</p><p>")}</p>`;
        const result = await client.createPost({
          integrationId: target.id,
          content: htmlContent,
          date: new Date().toISOString(),
        });

        await reply(
          `✅ *Posted to ${target.name}* (${target.platform})\n\n` +
          `"${intent.content.slice(0, 100)}${intent.content.length > 100 ? "..." : ""}"\n\n` +
          `_${client.requestsRemaining} API requests remaining this hour_`
        );
        break;
      }

      case "schedule": {
        if (!intent.date) {
          await reply("When should I schedule this? Example: `schedule my post for tomorrow at 9am`");
          break;
        }

        const integrations = await client.getIntegrations();
        let target = await findIntegration(integrations, intent.platform, intent.account);

        if (!target && session.selectedIntegrationId) {
          target = integrations.find((i) => i.id === session.selectedIntegrationId);
        }

        if (!target) {
          await reply(
            `Which account? Reply \`use <name>\` first.\n\n` +
            client.formatIntegrationList(integrations)
          );
          break;
        }

        if (!intent.content) {
          await reply("What content should I schedule? Send the text.");
          break;
        }

        // For now, pass the date string as-is — Postiz handles parsing
        const htmlContent = `<p>${intent.content.replace(/\n/g, "</p><p>")}</p>`;
        const result = await client.createPost({
          integrationId: target.id,
          content: htmlContent,
          date: intent.date,
        });

        await reply(
          `📅 *Scheduled for ${intent.date}*\n` +
          `Account: ${target.name} (${target.platform})\n\n` +
          `"${intent.content.slice(0, 100)}${intent.content.length > 100 ? "..." : ""}"`
        );
        break;
      }

      case "analytics": {
        await reply(
          "📊 *Analytics*\n\n" +
          "To view detailed analytics:\n" +
          `• Open the dashboard: ${POSTIZ_BASE_URL}\n` +
          "• Or use Claude Code: `/analytics`\n" +
          "• Or use Claude Code: `/track-analytics`\n\n" +
          "_Deep per-post analytics require Claude Code's Playwright integration " +
          "to scrape platform-native analytics pages._"
        );
        break;
      }

      case "unknown": {
        // If there's a selected account, treat as post content
        if (session.selectedIntegrationId && intent.raw.length > 10) {
          const integrations = await client.getIntegrations();
          const target = integrations.find((i) => i.id === session.selectedIntegrationId);
          if (target) {
            const htmlContent = `<p>${intent.raw.replace(/\n/g, "</p><p>")}</p>`;
            await client.createPost({
              integrationId: target.id,
              content: htmlContent,
              date: new Date().toISOString(),
            });
            await reply(
              `✅ *Posted to ${target.name}* (${target.platform})\n\n` +
              `"${intent.raw.slice(0, 100)}${intent.raw.length > 100 ? "..." : ""}"`
            );
            break;
          }
        }

        await reply(
          `I didn't understand that. Type \`help\` for available commands.\n\n` +
          `Or just send me content to post (select an account first with \`use <name>\`).`
        );
        break;
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    await reply(`❌ *Error:* ${message}`);
  }
}

async function main() {
  // Verify Postiz connection
  const healthy = await client.healthCheck();
  if (!healthy) {
    console.error(`Cannot reach Postiz at ${POSTIZ_BASE_URL}. Is it running?`);
    process.exit(1);
  }
  console.log(`Connected to Postiz at ${POSTIZ_BASE_URL}`);

  // Start channels
  const activeChannels: ChatChannel[] = [];

  for (const factory of factories) {
    try {
      const channel = await factory();
      if (channel) {
        await channel.start((msg) => handleMessage(msg, channel));
        activeChannels.push(channel);
      }
    } catch (error) {
      console.error(`Failed to start channel:`, error);
    }
  }

  if (activeChannels.length === 0) {
    console.error("No channels configured. Set credentials in .env for at least one channel.");
    process.exit(1);
  }

  console.log(`\n10x Social Media bot running on ${activeChannels.length} channel(s): ${activeChannels.map((c) => c.name).join(", ")}\n`);

  // Graceful shutdown
  const shutdown = async () => {
    console.log("\nShutting down...");
    for (const channel of activeChannels) {
      await channel.stop().catch(() => {});
    }
    sessions.destroy();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
