import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IPhoto {
  url: string;
}

interface IFeature {
  name: string;
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

interface IEvent {
  _id: string;
  name: string;
  banner_url: string;
  location: ILocation;
  price: number;
  phone: string;
  description: string;
  age_range: string;
  event_date: Date;
  features: IFeature[];
}

export interface IInstitute extends Document {
  _id: string;
  name: string;
  logo_photo: string;
  description: string;
  institute_type: string;
  partner_type: string;
  location: ILocation;
  price: number;
  phone: string;
  photos: IPhoto[];
  events: IEvent[];
}

const PhotoSchema = new Schema<IPhoto>({
  url: { type: String, required: true },
});

const FeatureSchema = new Schema<IFeature>({
  name: { type: String, required: true },
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

const EventSchema = new Schema<IEvent>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  banner_url: { type: String },
  location: { type: LocationSchema, required: true },
  price: { type: Number },
  phone: { type: String },
  description: { type: String },
  age_range: { type: String },
  event_date: { type: Date, required: true },
  features: [FeatureSchema],
});

const InstituteSchema: Schema = new Schema<IInstitute>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  logo_photo: { type: String },
  description: { type: String },
  institute_type: { type: String },
  partner_type: { type: String },
  location: { type: LocationSchema, required: true },
  price: { type: Number },
  phone: { type: String },
  photos: [PhotoSchema],
  events: [EventSchema],
});

export default mongoose.model<IInstitute>("institute", InstituteSchema);
