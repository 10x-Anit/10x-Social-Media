import pkg from "whatsapp-web.js";
const { Client: WAClient, LocalAuth } = pkg;
import type { ChatChannel, ChatMessage, ChannelFactory } from "../../types.js";

class WhatsAppChannel implements ChatChannel {
  readonly name = "whatsapp";
  private client: InstanceType<typeof WAClient>;

  constructor() {
    this.client = new WAClient({
      authStrategy: new LocalAuth({ dataPath: "./.wwebjs_auth" }),
      puppeteer: { headless: true, args: ["--no-sandbox"] },
    });
  }

  async start(onMessage: (msg: ChatMessage) => Promise<void>): Promise<void> {
    return new Promise((resolve) => {
      this.client.on("qr", (qr: string) => {
        console.log("[whatsapp] Scan this QR code in WhatsApp:");
        console.log(`[whatsapp] QR: ${qr}`);
        // In production, render QR with qrcode-terminal package
      });

      this.client.on("ready", () => {
        console.log("[whatsapp] Bot connected and ready");
        resolve();
      });

      this.client.on("message", async (msg: any) => {
        if (msg.fromMe) return;

        const contact = await msg.getContact();
        const chatMessage: ChatMessage = {
          channelName: this.name,
          userId: msg.from,
          userName: contact.pushname ?? contact.name ?? "Unknown",
          text: msg.body,
          replyTo: async (text: string) => {
            await msg.reply(text);
          },
        };

        await onMessage(chatMessage);
      });

      this.client.initialize();
    });
  }

  async send(chatId: string, text: string): Promise<void> {
    await this.client.sendMessage(chatId, text);
  }

  async stop(): Promise<void> {
    await this.client.destroy();
    console.log("[whatsapp] Bot stopped");
  }
}

export const createWhatsAppChannel: ChannelFactory = async () => {
  const enabled = process.env.WHATSAPP_ENABLED?.toLowerCase() === "true";
  if (!enabled) {
    console.log("[whatsapp] WHATSAPP_ENABLED not set to true — skipping");
    return null;
  }
  return new WhatsAppChannel();
};
