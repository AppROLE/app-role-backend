import { Schema } from 'mongoose';

export interface IAddress {
  latitude: number;
  longitude: number;
  street: string;
  number?: number;
  district: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export const AddressSchema = new Schema<IAddress>({
  latitude: {
    type: Number,
    required: true,
    set: (v: number) => parseFloat(v.toFixed(6)),
  },
  longitude: {
    type: Number,
    required: true,
    set: (v: number) => parseFloat(v.toFixed(6)),
  },
  street: { type: String, required: true },
  number: { type: Number },
  district: { type: String, required: true },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  cep: { type: String, required: true },
});
