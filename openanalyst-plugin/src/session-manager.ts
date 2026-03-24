import type { UserSession } from "./types.js";

export class SessionManager {
  private sessions = new Map<string, UserSession>();
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor(maxAgeMs = 24 * 60 * 60 * 1000) {
    this.cleanupInterval = setInterval(() => this.cleanup(maxAgeMs), 60 * 60 * 1000);
  }

  private key(channelName: string, userId: string): string {
    return `${channelName}:${userId}`;
  }

  getOrCreate(channelName: string, userId: string): UserSession {
    const k = this.key(channelName, userId);
    let session = this.sessions.get(k);
    if (!session) {
      session = { userId, channelName, lastActivity: Date.now() };
      this.sessions.set(k, session);
    }
    session.lastActivity = Date.now();
    return session;
  }

  setSelectedAccount(
    channelName: string,
    userId: string,
    integrationId: string,
    integrationName: string
  ): void {
    const session = this.getOrCreate(channelName, userId);
    session.selectedIntegrationId = integrationId;
    session.selectedIntegrationName = integrationName;
  }

  getSelectedAccount(channelName: string, userId: string): { id?: string; name?: string } {
    const session = this.sessions.get(this.key(channelName, userId));
    return {
      id: session?.selectedIntegrationId,
      name: session?.selectedIntegrationName,
    };
  }

  cleanup(maxAgeMs: number): void {
    const now = Date.now();
    for (const [key, session] of this.sessions) {
      if (now - session.lastActivity > maxAgeMs) {
        this.sessions.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.sessions.clear();
  }
}
