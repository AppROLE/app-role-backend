import { EntityError } from "src/shared/helpers/errors/errors";

interface PresenceProps {
  presenceId: string,
  eventId: string,
  userId: string,
  promoterCode?: string,
  createdAt: Date
}

export class Presence {
  presenceId: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: Date;

  constructor(props: PresenceProps) {
    this.presenceId = props.presenceId;
    this.eventId = props.eventId;
    this.userId = props.userId;
    this.promoterCode = props.promoterCode;
    this.createdAt = props.createdAt;
  }
}