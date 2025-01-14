import { Address } from 'src/shared/domain/entities/address';

export type EventCardReturn = {
  eventId: string;
  presenceId: string;
  eventName: string;
  eventDate: number;
  instituteName: string;
  instituteRating: number;
  address: Address;
  photo: string;
};
