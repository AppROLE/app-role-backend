import { Presence } from "src/shared/domain/entities/presence";
import { IPresence, PresenceModel } from "../models/presence.model";

export interface PresenceMongoDTOProps {
  _id: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: Date;
}

export class PresenceMongoDTO {
  _id: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: Date;

  constructor(props: PresenceMongoDTOProps) {
    this._id = props._id;
    this.eventId = props.eventId;
    this.userId = props.userId;
    this.promoterCode = props.promoterCode;
    this.createdAt = props.createdAt;
  }

  static fromMongo(presence: any): PresenceMongoDTO {
    return new PresenceMongoDTO({
      _id: presence._id,
      eventId: presence.event_id,
      userId: presence.username,
      promoterCode: presence.promoter_code,
      createdAt: presence.createdAt,
    });
  }

  toEntity(): Presence {
    return new Presence({
      presenceId: this._id,
      eventId: this.eventId,
      userId: this.userId,
      promoterCode: this.promoterCode,
      createdAt: this.createdAt,
    });
  }

  static fromEntity(presence: Presence): PresenceMongoDTO {
    return new PresenceMongoDTO({
      _id: presence.presenceId,
      eventId: presence.eventId,
      userId: presence.userId,
      promoterCode: presence.promoterCode,
      createdAt: presence.createdAt,
    });
  }

  toMongo(): IPresence {
    return new PresenceModel({
      _id: this._id,
      event_id: this.eventId,
      username: this.userId,
      promoter_code: this.promoterCode,
      createdAt: this.createdAt,
    });
  }
}
