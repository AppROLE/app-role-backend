import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { AddressSchema, IAddress } from "../schemas/address_schema";
import { Address } from "src/shared/domain/entities/address";
import { AGE_ENUM } from "src/shared/domain/enums/age_enum";
import { STATUS } from "src/shared/domain/enums/status_enum";
import { MUSIC_TYPE } from "src/shared/domain/enums/music_type_enum";
import { PACKAGE_TYPE } from "src/shared/domain/enums/package_type_enum";
import { CATEGORY } from "src/shared/domain/enums/category_enum";
import { FEATURE } from "src/shared/domain/enums/feature_enum";

export interface IEvent extends Document {
  _id: string;
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: number;
  instituteId: string;
  eventStatus: STATUS;
  musicType: MUSIC_TYPE[];
  menuLink?: string;
  eventPhotoLink?: string;
  galeryLink: string[];
  bannerUrl?: string;
  packageType: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
  reviewsId: string[];
  presencesId: string[];
  createdAt: number;
  updatedAt: number;
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
  eventDate: { type: Number, required: true },
  features: [{ type: String }],
  musicType: [{ type: String }],
  menuLink: { type: String },
  galeryLink: [{ type: String }],
  packageType: [{ type: String }],
  category: { type: String },
  ticketUrl: { type: String },
  reviewsId: [{ type: String, ref: "Review" }],
  eventStatus: { type: String, required: true },
  presencesId: [{ type: String, ref: "Presence" }],
  eventPhotoLink: { type: String },
  createdAt: { type: Number },
  updatedAt: { type: Number },
});

export const EventModel = mongoose.model<IEvent>("Event", EventSchema);
