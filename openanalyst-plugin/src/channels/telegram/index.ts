import TelegramBot from "node-telegram-bot-api";
import type { ChatChannel, ChatMessage, ChannelFactory } from "../../types.js";

class TelegramChannel implements ChatChannel {
  readonly name = "telegram";
  private bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
  }

  async start(onMessage: (msg: ChatMessage) => Promise<void>): Promise<void> {
    this.bot.on("message", async (msg) => {
      if (!msg.text || msg.from?.is_bot) return;

      const chatMessage: ChatMessage = {
        channelName: this.name,
        userId: String(msg.from?.id ?? msg.chat.id),
        userName: msg.from?.first_name ?? "Unknown",
        text: msg.text,
        replyTo: async (text: string) => {
          await this.bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
        },
      };

      await onMessage(chatMessage);
    });

    const me = await this.bot.getMe();
    console.log(`[telegram] Bot started: @${me.username}`);
  }

  async send(chatId: string, text: string): Promise<void> {
    await this.bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  }

  async stop(): Promise<void> {
    await this.bot.stopPolling();
    console.log("[telegram] Bot stopped");
  }
}

export const createTelegramChannel: ChannelFactory = async () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log("[telegram] TELEGRAM_BOT_TOKEN not set — skipping");
    return null;
  }
  return new TelegramChannel(token);
};
