import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IReview {
  institute_id: string;
  event_id: string;
  star: number;
  review: string;
  reviewed_at?: Date;
}
export interface IEvent extends Document {
  _id: string;
  institute_id: string;
  name: string;
  banner_url: string;
  address: string;
  price: number;
  description: string;
  age_range: string;
  event_date: Date;
  district_id: string;
  music_type: string[];
  menu_link: string;
  galery_link: string[];
  package_type: string[];
  category: string;
  features: string[];
  ticket_url: string;
  reviews: IReview[];
}
const ReviewSchema = new Schema<IReview>({
  institute_id: { type: String, ref: "Institute" },
  event_id: { type: String, ref: "Event" },
  star: { type: Number, required: true },
  review: { type: String, required: true },
  reviewed_at: { type: Date, default: Date.now },
});

const EventSchema: Schema = new Schema<IEvent>({
  _id: { type: String, default: uuidv4 },
  institute_id: { type: String, ref: "Institute", required: true },
  name: { type: String, required: true },
  banner_url: { type: String },
  address: { type: String, required: true },
  price: { type: Number },
  description: { type: String },
  age_range: { type: String },
  event_date: { type: Date, required: true },
  district_id: { type: String, required: true },
  features: [{ type: String, ref: "Feature" }],
  music_type: [{ type: String }],
  menu_link: { type: String },
  galery_link: [{ type: String }],
  package_type: [{ type: String }],
  category: { type: String },
  ticket_url: { type: String },
  reviews: [ReviewSchema],
});

export default mongoose.model<IEvent>("Event", EventSchema);
