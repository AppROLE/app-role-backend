import { Presence } from '../entities/presence';

export interface IPresenceRepository {
  createPresence(presence: Presence): Promise<Presence>;
  deletePresence(eventId: string, userId: string): Promise<void>;
  getPresencesByIds(presencesIds: string[]): Promise<Presence[]>;
  getPresencesByEvent(eventId: string): Promise<Presence[]>;
  getPresencesByUser(userId: string): Promise<Presence[]>;
  getPresencesByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<Presence | null>;
}
