import { Client, GatewayIntentBits, Events } from "discord.js";
import type { ChatChannel, ChatMessage, ChannelFactory } from "../../types.js";

class DiscordChannel implements ChatChannel {
  readonly name = "discord";
  private client: Client;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
    });
  }

  async start(onMessage: (msg: ChatMessage) => Promise<void>): Promise<void> {
    this.client.on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;

      const chatMessage: ChatMessage = {
        channelName: this.name,
        userId: message.author.id,
        userName: message.author.displayName ?? message.author.username,
        text: message.content,
        threadId: message.channelId,
        replyTo: async (text: string) => {
          await message.reply(text);
        },
      };

      await onMessage(chatMessage);
    });

    await this.client.login(this.token);
    console.log(`[discord] Bot started: ${this.client.user?.tag}`);
  }

  async send(channelId: string, text: string): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);
    if (channel?.isTextBased() && "send" in channel) {
      await channel.send(text);
    }
  }

  async stop(): Promise<void> {
    await this.client.destroy();
    console.log("[discord] Bot stopped");
  }
}

export const createDiscordChannel: ChannelFactory = async () => {
  const token = process.env.DISCORD_CHAT_BOT_TOKEN;
  if (!token) {
    console.log("[discord] DISCORD_CHAT_BOT_TOKEN not set — skipping");
    return null;
  }
  return new DiscordChannel(token);
};
