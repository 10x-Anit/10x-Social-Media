export interface ChatMessage {
  channelName: string;
  userId: string;
  userName: string;
  text: string;
  threadId?: string;
  replyTo?: (text: string) => Promise<void>;
}

export interface ChatChannel {
  readonly name: string;
  start(onMessage: (msg: ChatMessage) => Promise<void>): Promise<void>;
  send(target: string, text: string): Promise<void>;
  stop(): Promise<void>;
}

export type ChannelFactory = () => Promise<ChatChannel | null>;

export interface PostizIntegration {
  id: string;
  platform: string;
  name: string;
  status: string;
}

export interface CreatePostRequest {
  integrationId: string;
  content: string;
  date: string;
  media?: { url: string }[];
}

export interface PostAnalytics {
  postId: string;
  impressions?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  engagement_rate?: number;
}

export interface UserSession {
  userId: string;
  channelName: string;
  selectedIntegrationId?: string;
  selectedIntegrationName?: string;
  lastActivity: number;
}

export type CommandIntent =
  | { type: "post"; platform?: string; account?: string; content?: string }
  | { type: "schedule"; platform?: string; account?: string; content?: string; date?: string }
  | { type: "analytics"; postId?: string; platform?: string }
  | { type: "list_integrations" }
  | { type: "list_posts" }
  | { type: "select_account"; account: string }
  | { type: "help" }
  | { type: "unknown"; raw: string };
