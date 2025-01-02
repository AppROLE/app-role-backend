import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPhrase extends Document {
  _id: string;
  phrase: string;
}

const EventSchema: Schema = new Schema<IPhrase>({
  _id: { type: String, default: uuidv4 },
  phrase: { type: String, required: true },
});

export default mongoose.model<IPhrase>("phrase", EventSchema);
