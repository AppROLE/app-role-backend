import mongoose, { Schema, Document } from 'mongoose';
import { uuidv4 } from 'src/shared/helpers/utils/uuid_util';

export interface IPresence extends Document {
  _id: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: number;
}

const PresenceSchema: Schema = new Schema<IPresence>({
  _id: { type: String, default: uuidv4 },
  eventId: { type: String, ref: 'events', required: true },
  userId: { type: String, ref: 'profiles', required: true },
  promoterCode: { type: String },
  createdAt: { type: Number },
});

export const PresenceModel = mongoose.model<IPresence>(
  'presences',
  PresenceSchema
);
