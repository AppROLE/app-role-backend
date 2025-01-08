import { Schema } from "mongoose";

export interface IAddress {
    latitude: number;
    longitude: number;
    address: string;
    number: number;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  }

export const AddressSchema = new Schema<IAddress>({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    number: { type: Number},
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    cep: { type: String, required: true },
});