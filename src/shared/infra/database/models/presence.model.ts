import mongoose, { Schema, Document } from 'mongoose';
import { uuidv4 } from 'src/shared/helpers/utils/uuid_util';

export interface IPresence extends Document {
  _id: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: Date;
  eventDate: Date;
}

const PresenceSchema: Schema = new Schema<IPresence>({
  _id: { type: String, default: uuidv4 },
  eventId: { type: String, ref: 'events', required: true },
  userId: { type: String, ref: 'profiles', required: true },
  promoterCode: { type: String },
  createdAt: { type: Date, required: true },
  eventDate: { type: Date, required: true },
});

export const PresenceModel = mongoose.model<IPresence>(
  'presences',
  PresenceSchema
);
