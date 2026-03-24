import type { PostizIntegration, CreatePostRequest } from "./types.js";

export class PostizClient {
  private baseUrl: string;
  private apiKey: string;
  private requestTimestamps: number[] = [];

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  private trackRequest() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    this.requestTimestamps = this.requestTimestamps.filter((t) => t > oneHourAgo);
    this.requestTimestamps.push(now);
  }

  get requestsRemaining(): number {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    const recent = this.requestTimestamps.filter((t) => t > oneHourAgo).length;
    return Math.max(0, 30 - recent);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(this.baseUrl);
      return res.ok || res.status === 301 || res.status === 302;
    } catch {
      return false;
    }
  }

  async getIntegrations(): Promise<PostizIntegration[]> {
    this.trackRequest();
    const res = await fetch(`${this.baseUrl}/api/public/v1/integrations`, {
      headers: this.headers,
    });
    if (!res.ok) throw new Error(`Postiz API error: ${res.status} ${res.statusText}`);
    return res.json();
  }

  async createPost(post: CreatePostRequest): Promise<{ postId: string }> {
    if (this.requestsRemaining <= 2) {
      throw new Error("Rate limit almost reached (30/hr). Try again in a few minutes.");
    }
    this.trackRequest();
    const res = await fetch(`${this.baseUrl}/api/public/v1/posts`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(post),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to create post: ${res.status} — ${body}`);
    }
    return res.json();
  }

  async uploadMedia(file: Buffer, filename: string): Promise<{ url: string }> {
    this.trackRequest();
    const form = new FormData();
    form.append("file", new Blob([file]), filename);
    const res = await fetch(`${this.baseUrl}/api/public/v1/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: form,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return res.json();
  }

  formatIntegrationList(integrations: PostizIntegration[]): string {
    if (integrations.length === 0) {
      return "No accounts connected. Open the Postiz dashboard to add platforms.";
    }
    const lines = integrations.map(
      (i, idx) => `${idx + 1}. ${i.platform} — "${i.name}" (${i.status})`
    );
    return `Connected accounts:\n${lines.join("\n")}`;
  }
}
