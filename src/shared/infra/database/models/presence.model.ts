import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPresence extends Document {
  _id: string;
  event_id: string;
  username: string;
  nickname: string;
  profile_photo: string | undefined;
  promoter_code: string | undefined;
  checked_in_at: Date | undefined;
}

const PresenceSchema: Schema = new Schema<IPresence>({
  _id: { type: String, default: uuidv4 },
  event_id: { type: String, ref: "event", required: true },
  username: { type: String, ref: "user", required: true },
  nickname: { type: String, required: true },
  profile_photo: { type: String },
  promoter_code: { type: String },
  checked_in_at: { type: Date, default: Date.now },
});

PresenceSchema.index({ event_id: 1 });

export default mongoose.model<IPresence>("presence", PresenceSchema);
