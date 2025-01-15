import mongoose, { Connection, Schema } from 'mongoose';
import { constants } from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '../.env') });

export interface IPresence extends Document {
  _id: string;
  eventId: string;
  userId: string;
  promoterCode?: string;
  createdAt: Date;
  eventDate: Date;
}

const PresenceSchema: Schema = new Schema<IPresence>({
  _id: { type: String, default: uuidv4 },
  eventId: { type: String, ref: 'events', required: true },
  userId: { type: String, ref: 'profiles', required: true },
  promoterCode: { type: String },
  createdAt: { type: Date, required: true },
  eventDate: { type: Date, required: true },
});

export const PresenceModel = mongoose.model<IPresence>(
  'presences',
  PresenceSchema
);

async function requestMongo() {
  await mongoose.connect(process.env.MONGO_URI!);

  const page = 1;
  const userId = 'e3ecfa0a-5061-70c0-f914-53c700ac50f6';
  const limit = 30; // Limite fixo por página
  const skip = (page - 1) * limit;
  const today = new Date();

  // Agregação para buscar eventos com presença confirmada
  const aggregateResult = await PresenceModel.aggregate([
    // Filtrar presenças do usuário
    { $match: { userId } },
    // Trazer eventos associados às presenças
    {
      $lookup: {
        from: 'events',
        localField: 'eventId',
        foreignField: '_id',
        as: 'event',
      },
    },
    { $unwind: { path: '$event', preserveNullAndEmptyArrays: false } },
    // Filtrar eventos com data futura
    { $match: { 'event.eventDate': { $gt: today } } },
    // Trazer dados dos institutos relacionados aos eventos
    {
      $lookup: {
        from: 'institutes',
        localField: 'event.instituteId',
        foreignField: '_id',
        as: 'institute',
      },
    },
    { $unwind: { path: '$institute', preserveNullAndEmptyArrays: false } },
    // Projetar os campos necessários
    {
      $project: {
        eventId: '$event._id',
        presenceId: '$_id',
        eventName: '$event.name',
        eventDate: '$event.eventDate',
        instituteName: '$institute.name',
        instituteRating: '$institute.rating',
        address: '$event.address',
        photo: '$event.eventPhoto',
      },
    },
    // Paginação
    { $skip: skip },
    { $limit: limit },
  ]);

  // Contar o total de presenças confirmadas
  const totalCount = await PresenceModel.aggregate([
    { $match: { userId } },
    {
      $lookup: {
        from: 'events',
        localField: 'eventId',
        foreignField: '_id',
        as: 'event',
      },
    },
    { $unwind: { path: '$event', preserveNullAndEmptyArrays: false } },
    { $match: { 'event.eventDate': { $gt: today } } },
    { $count: 'total' },
  ]).then((res) => (res.length > 0 ? res[0].total : 0));

  const totalPages = Math.ceil(totalCount / limit);

  const result = {
    items: aggregateResult,
    totalPages,
    totalCount,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  };

  console.log(result);

  await mongoose.disconnect();
}

requestMongo();
