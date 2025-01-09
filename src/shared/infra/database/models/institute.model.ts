import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { AddressSchema, IAddress } from "../schemas/address_schema";

export interface IInstitute extends Document {
  _id: string;
  name: string;
  description: string;
  instituteType: string;
  partnerType: string;
  phone?: string;
  logoPhoto: string;
  address: IAddress;
  price?: number;
  photosUrl: string[];
  eventsId: string[];
}

const InstituteSchema: Schema = new Schema<IInstitute>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  description: { type: String, required: true },
  instituteType: { type: String, required: true },
  partnerType: { type: String, required: true },
  phone: { type: String },
  logoPhoto: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  price: { type: Number },
  photosUrl: [{ type: String, required: true }],
  eventsId: [{ type: String, ref: "Event" }],
});

export const InstituteModel = mongoose.model<IInstitute>(
  "Institute",
  InstituteSchema
);
