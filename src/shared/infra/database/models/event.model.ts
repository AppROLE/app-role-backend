import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { AddressSchema, IAddress } from "../schemas/address_schema";

export interface IEvent extends Document {
  _id: string;
  instituteId: string;
  name: string;
  bannerUrl: string;
  address: IAddress;
  price: number;
  description: string;
  ageRange: string;
  eventDate: Date;
  musicType: string[];
  menuLink: string;
  galeryLink: string[];
  packageType: string[];
  category: string;
  features: string[];
  ticketUrl: string;
  reviews: string[];
  eventStatus: string;
}

const EventSchema: Schema = new Schema<IEvent>({
  _id: { type: String, default: uuidv4 },
  instituteId: { type: String, ref: "Institute" },
  name: { type: String, required: true },
  bannerUrl: { type: String },
  address: { type: AddressSchema, required: true },
  price: { type: Number },
  description: { type: String },
  ageRange: { type: String },
  eventDate: { type: Date, required: true },
  features: [{ type: String }],
  musicType: [{ type: String }],
  menuLink: { type: String },
  galeryLink: [{ type: String }],
  packageType: [{ type: String }],
  category: { type: String },
  ticketUrl: { type: String },
  reviews: [{ type: String, ref: "Review" }],
  eventStatus: { type: String, required: true },
});

export default mongoose.model<IEvent>("Event", EventSchema);
