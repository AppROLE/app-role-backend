import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPresence extends Document {
  _id: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: Date;
}

const PresenceSchema: Schema = new Schema<IPresence>({
  _id: { type: String, default: uuidv4 },
  eventId: { type: String, ref: "Event", required: true },
  userId: { type: String, ref: "Profile", required: true },
  promoterCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const PresenceModel = mongoose.model<IPresence>(
  "Presence",
  PresenceSchema
);
