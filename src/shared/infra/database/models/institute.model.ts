import mongoose, { Schema, Document } from 'mongoose';
import { AddressSchema, IAddress } from './address.model';
import { INSTITUTE_TYPE } from 'src/shared/domain/enums/institute_type_enum';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';
import { uuidv4 } from 'src/shared/helpers/utils/uuid_util';

export interface IInstitute extends Document {
  _id: string;
  name: string;
  description: string;
  instituteType: INSTITUTE_TYPE;
  partnerType: PARTNER_TYPE;
  phone?: string;
  logo: string;
  address: IAddress;
  price?: number;
  rating?: number;
  eventsId: string[];
  reviewsId: string[];
  createdAt: Date;
  updatedAt: Date;
}

const InstituteSchema: Schema = new Schema<IInstitute>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  description: { type: String, required: true },
  instituteType: { type: String, required: true },
  partnerType: { type: String, required: true },
  phone: { type: String },
  logo: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  price: { type: Number },
  rating: { type: Number },
  eventsId: [{ type: String, ref: 'events' }],
  reviewsId: [{ type: String, ref: 'reviews' }],
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const InstituteModel = mongoose.model<IInstitute>(
  'institutes',
  InstituteSchema
);
