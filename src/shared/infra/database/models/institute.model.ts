import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { AddressSchema, IAddress } from "../schemas/address_schema";

interface IPhoto {
  url: string;
}

interface IFeature {
  name: string;
}

interface IEvent {
  _id: string;
  name: string;
  bannerUrl: string;
  address: IAddress;
  price: number;
  phone: string;
  description: string;
  ageRange: string;
  eventDate: Date;
  features: IFeature[];
}

export interface IInstitute extends Document {
  _id: string;
  name: string;
  logoPhoto: string;
  description: string;
  institute_type: string;
  partner_type: string;
  address: IAddress;
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


const InstituteSchema: Schema = new Schema<IInstitute>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  logoPhoto: { type: String },
  description: { type: String },
  institute_type: { type: String },
  partner_type: { type: String },
  address: { type: AddressSchema, required: true },
  price: { type: Number },
  phone: { type: String },
  photos: [PhotoSchema],
  events: [EventSchema],
});

export default mongoose.model<IInstitute>("institute", InstituteSchema);
