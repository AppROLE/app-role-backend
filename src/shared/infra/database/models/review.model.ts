import mongoose, { Schema, Document } from 'mongoose';
import { uuidv4 } from 'src/shared/helpers/utils/uuid_util';

export interface IReview extends Document {
  _id: string;
  userId: string;
  eventId: string;
  review: string;
  rating: number;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  _id: { type: String, default: uuidv4 },
  userId: { type: String, ref: 'profiles', required: true },
  eventId: { type: String, ref: 'events', required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date },
});

export const ReviewModel = mongoose.model<IReview>('reviews', ReviewSchema);
