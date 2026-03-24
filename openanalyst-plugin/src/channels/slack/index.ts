import { App } from "@slack/bolt";
import type { ChatChannel, ChatMessage, ChannelFactory } from "../../types.js";

class SlackChannel implements ChatChannel {
  readonly name = "slack";
  private app: App;

  constructor(botToken: string, appToken: string) {
    this.app = new App({
      token: botToken,
      appToken,
      socketMode: true,
    });
  }

  async start(onMessage: (msg: ChatMessage) => Promise<void>): Promise<void> {
    this.app.message(async ({ message, say }) => {
      if (message.subtype || !("text" in message) || !message.text) return;

      const chatMessage: ChatMessage = {
        channelName: this.name,
        userId: message.user ?? "unknown",
        userName: message.user ?? "Unknown",
        text: message.text,
        threadId: ("thread_ts" in message ? message.thread_ts : undefined) as string | undefined,
        replyTo: async (text: string) => {
          await say({ text, mrkdwn: true });
        },
      };

      await onMessage(chatMessage);
    });

    await this.app.start();
    console.log("[slack] Bot started (Socket Mode)");
  }

  async send(channel: string, text: string): Promise<void> {
    await this.app.client.chat.postMessage({ channel, text, mrkdwn: true });
  }

  async stop(): Promise<void> {
    await this.app.stop();
    console.log("[slack] Bot stopped");
  }
}

export const createSlackChannel: ChannelFactory = async () => {
  const botToken = process.env.SLACK_BOT_TOKEN;
  const appToken = process.env.SLACK_APP_TOKEN;
  if (!botToken || !appToken) {
    console.log("[slack] SLACK_BOT_TOKEN or SLACK_APP_TOKEN not set — skipping");
    return null;
  }
  return new SlackChannel(botToken, appToken);
};
