import { Presence } from "src/shared/domain/entities/presence";
import presenceModel, { IPresence as PresenceDocument } from "../models/presence.model";

export interface PresenceMongoDTOProps {
  _id: string,
  eventId: string,
  userId: string,
  promoterCode?: string,
  createdAt: Date
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
      createdAt: presence.createdAt
    });
  }

  static toEntity(presenceMongoDTO: PresenceMongoDTO): Presence {
    return new Presence({
      presenceId: presenceMongoDTO._id,
      eventId: presenceMongoDTO.eventId,
      userId: presenceMongoDTO.userId,
      promoterCode: presenceMongoDTO.promoterCode,
      createdAt: presenceMongoDTO.createdAt
    });
  }

  static fromEntity(presence: Presence): PresenceMongoDTO {
    return new PresenceMongoDTO({
      _id: presence.presenceId,
      eventId: presence.eventId,
      userId: presence.userId,
      promoterCode: presence.promoterCode,
      createdAt: presence.createdAt
    });
  }

  static toMongo(presenceMongoDTO: PresenceMongoDTO): PresenceDocument {
    return new presenceModel({
      _id: presenceMongoDTO._id,
      event_id: presenceMongoDTO.eventId,
      username: presenceMongoDTO.userId,
      promoter_code: presenceMongoDTO.promoterCode,
      createdAt: presenceMongoDTO.createdAt
    })

  }
}