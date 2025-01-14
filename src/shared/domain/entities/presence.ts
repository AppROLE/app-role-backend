interface PresenceProps {
  presenceId: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: number;
  eventDate: number;
}

export class Presence {
  presenceId: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: number;
  eventDate: number;

  constructor(props: PresenceProps) {
    this.presenceId = props.presenceId;
    this.eventId = props.eventId;
    this.userId = props.userId;
    this.promoterCode = props.promoterCode;
    this.createdAt = props.createdAt;
    this.eventDate = props.eventDate;
  }
}
