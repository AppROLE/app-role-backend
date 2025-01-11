import mongoose, { Schema, Document } from 'mongoose';
import { AddressSchema } from '../schemas/address_schema';
import { Address } from 'src/shared/domain/entities/address';
import { AGE_ENUM } from 'src/shared/domain/enums/age_enum';
import { STATUS } from 'src/shared/domain/enums/status_enum';
import { MUSIC_TYPE } from 'src/shared/domain/enums/music_type_enum';
import { PACKAGE_TYPE } from 'src/shared/domain/enums/package_type_enum';
import { CATEGORY } from 'src/shared/domain/enums/category_enum';
import { FEATURE } from 'src/shared/domain/enums/feature_enum';
import { uuidv4 } from 'src/shared/helpers/utils/uuid_util';

export interface IEvent extends Document {
  _id: string;
  name: string;
  description: string;
  address: Address;
  price: number;
  ageRange: AGE_ENUM;
  eventDate: Date;
  instituteId: string;
  eventStatus: STATUS;
  musicType: MUSIC_TYPE[];
  menuLink?: string;
  eventPhoto: string;
  galleryLink: string[];
  packageType: PACKAGE_TYPE[];
  category?: CATEGORY;
  ticketUrl?: string;
  features: FEATURE[];
  reviewsId: string[];
  presencesId: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema<IEvent>({
  _id: { type: String, default: uuidv4 },
  instituteId: { type: String, ref: 'institutes' },
  name: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  price: { type: Number },
  description: { type: String },
  ageRange: { type: String },
  eventDate: { type: Date, required: true },
  features: [{ type: String }],
  musicType: [{ type: String }],
  menuLink: { type: String },
  galleryLink: [{ type: String }],
  packageType: [{ type: String }],
  category: { type: String },
  ticketUrl: { type: String },
  reviewsId: [{ type: String, ref: 'reviews' }],
  eventStatus: { type: String, required: true },
  presencesId: [{ type: String, ref: 'presences' }],
  eventPhoto: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const EventModel = mongoose.model<IEvent>('events', EventSchema);
