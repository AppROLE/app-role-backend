import { Presence } from "../entities/presence";

export interface IPresenceRepository {
  getAllPresences(eventId: string): Promise<Presence[]>;
  confirmPresence(
    eventId: string,
    username: string,
    nickname: string,
    profilePhoto?: string,
    promoterCode?: string
  ): Promise<void>;
  countPresencesByEvent(eventIds: string[]): Promise<{ eventId: string, count: number }[]>;
  getPresenceByEventAndUser(eventId: string, username: string): Promise<Presence | null>;
  unConfirmPresence(eventId: string, username: string): Promise<void>;
}