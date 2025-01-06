import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IReview {
  username: string;
  star: number;
  review: string;
  name: string;
  photoUrl: string;
  reviewed_at?: Date;
}

interface ILocation {
  latitude: number;
  longitude: number;
  address: string;
  number: number;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export interface IEvent extends Document {
  _id: string;
  institute_id: string;
  name: string;
  banner_url: string;
  location: ILocation;
  price: number;
  description: string;
  age_range: string;
  event_date: Date;
  music_type: string[];
  menu_link: string;
  galery_link: string[];
  package_type: string[];
  category: string;
  features: string[];
  ticket_url: string;
  reviews: IReview[];
  eventStatus: string;
}

const ReviewSchema = new Schema<IReview>({
  username: { type: String },
  name: { type: String },
  photoUrl: { type: String },
  star: { type: Number, required: true },
  review: { type: String, required: true },
  reviewed_at: { type: Date, default: Date.now },
});

const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  number: { type: Number, required: true },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  cep: { type: String, required: true },
});

const EventSchema: Schema = new Schema<IEvent>({
  _id: { type: String, default: uuidv4 },
  institute_id: { type: String, ref: "institute", required: true },
  name: { type: String, required: true },
  banner_url: { type: String },
  location: { type: LocationSchema, required: true },
  price: { type: Number },
  description: { type: String },
  age_range: { type: String },
  event_date: { type: Date, required: true },
  features: [{ type: String, ref: "feature" }],
  music_type: [{ type: String }],
  menu_link: { type: String },
  galery_link: [{ type: String }],
  package_type: [{ type: String }],
  category: { type: String },
  ticket_url: { type: String },
  reviews: [ReviewSchema],
  eventStatus: { type: String, required: true },
});

export default mongoose.model<IEvent>("event", EventSchema);
