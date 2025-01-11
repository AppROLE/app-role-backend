import { Presence } from '../entities/presence';

export interface IPresenceRepository {
  createPresence(presence: Presence): Promise<Presence>;
  deletePresence(presenceId: string): Promise<void>;
  getPresenceById(presenceId: string): Promise<Presence | null>;
  getPresencesByIds(presencesIds: string[]): Promise<Presence[]>;
  getPresencesByEvent(eventId: string): Promise<Presence[]>;
  getPresencesByUser(userId: string): Promise<Presence[]>;
  getPresencesByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<Presence | null>;
}
