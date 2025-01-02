import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IDistrict extends Document {
  _id: string;
  name: string; // nome da zona (leste, oeste, norte, sul)
  neighborhoods: string[]; // bairros que compõem a zona
}

const DistrictSchema = new Schema<IDistrict>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  neighborhoods: [{ type: String }],
});

export default mongoose.model<IDistrict>("district", DistrictSchema);
