import { Presence } from "src/shared/domain/entities/presence";
import { IPresence, PresenceModel } from "../models/presence.model";

export interface PresenceMongoDTOProps {
  presenceId: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: number;
}

export class PresenceMongoDTO {
  presenceId: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: number;

  constructor(props: PresenceMongoDTOProps) {
    this.presenceId = props.presenceId;
    this.eventId = props.eventId;
    this.userId = props.userId;
    this.promoterCode = props.promoterCode;
    this.createdAt = props.createdAt;
  }

  static fromMongo(presence: IPresence): PresenceMongoDTO {
    return new PresenceMongoDTO({
      presenceId: presence._id,
      eventId: presence.eventId,
      userId: presence.userId,
      promoterCode: presence.promoterCode,
      createdAt: presence.createdAt.getTime(),
    });
  }

  toEntity(): Presence {
    return new Presence({
      presenceId: this.presenceId,
      eventId: this.eventId,
      userId: this.userId,
      promoterCode: this.promoterCode,
      createdAt: this.createdAt,
    });
  }

  static fromEntity(presence: Presence): PresenceMongoDTO {
    return new PresenceMongoDTO({
      presenceId: presence.presenceId,
      eventId: presence.eventId,
      userId: presence.userId,
      promoterCode: presence.promoterCode,
      createdAt: presence.createdAt,
    });
  }

  toMongo(): IPresence {
    return new PresenceModel({
      presenceId: this.presenceId,
      eventId: this.eventId,
      userId: this.userId,
      promoterCode: this.promoterCode,
      createdAt: this.createdAt,
    });
  }
}
