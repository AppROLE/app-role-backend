import { Institute } from '../../../domain/entities/institute';
import { IInstituteRepository } from '../../../domain/repositories/institute_repository_interface';
import { IInstitute } from '../models/institute.model';
import { InstituteMongoDTO } from '../dtos/institute_mongo_dto';
import {
  NoItemsFound,
  DuplicatedItem,
  MissingParameters,
} from '../../../../../src/shared/helpers/errors/errors';
import { Collection, Connection } from 'mongoose';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';

export class InstituteRepositoryMongo implements IInstituteRepository {
  private instituteCollection: Collection<IInstitute>;

  constructor(connection: Connection) {
    this.instituteCollection = connection.collection<IInstitute>('institutes');
  }

  async createInstitute(institute: Institute): Promise<Institute> {
    const instituteDoc = InstituteMongoDTO.fromEntity(institute).toMongo();

    const result = await this.instituteCollection.insertOne(instituteDoc);
    if (!result.acknowledged) {
      throw new Error('Failed to create institute in MongoDB.');
    }

    const createdInstituteDoc = await this.instituteCollection.findOne({
      _id: institute.instituteId,
    });

    if (!createdInstituteDoc) {
      throw new NoItemsFound('institute');
    }

    return InstituteMongoDTO.fromMongo(createdInstituteDoc).toEntity();
  }

  async getInstituteById(instituteId: string): Promise<Institute | null> {
    const instituteDoc = await this.instituteCollection.findOne({
      _id: instituteId,
    });

    if (!instituteDoc) {
      return null;
    }

    return InstituteMongoDTO.fromMongo(instituteDoc).toEntity();
  }

  async getAllInstitutes(): Promise<Institute[]> {
    const instituteDocs = await this.instituteCollection.find().toArray();

    if (!instituteDocs || instituteDocs.length === 0) {
      throw new NoItemsFound('institutes');
    }

    return instituteDocs.map((doc) =>
      InstituteMongoDTO.fromMongo(doc).toEntity()
    );
  }

  async getInstitutesByIds(institutesId: string[]): Promise<Institute[]> {
    const instituteDocs = await this.instituteCollection
      .find({ _id: { $in: institutesId } })
      .toArray();

    if (!instituteDocs || instituteDocs.length === 0) {
      return [];
    }

    return instituteDocs.map((doc) =>
      InstituteMongoDTO.fromMongo(doc).toEntity()
    );
  }

  async deleteInstituteById(instituteId: string): Promise<void> {
    const result = await this.instituteCollection.deleteOne({
      _id: instituteId,
    });

    if (!result.deletedCount || result.deletedCount === 0) {
      throw new NoItemsFound('institute');
    }
  }

  async getAllInstitutesByPartnerType(
    partnerType: PARTNER_TYPE
  ): Promise<Institute[]> {
    const instituteDocs = await this.instituteCollection
      .find({ partnerType: partnerType })
      .toArray();

    if (!instituteDocs || instituteDocs.length === 0) {
      return [];
    }

    return instituteDocs.map((doc) =>
      InstituteMongoDTO.fromMongo(doc).toEntity()
    );
  }

  async updateInstitute(
    instituteId: string, updatedFields: Partial<Institute>
  ): Promise<Institute> {
    const sanitizedFields = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, value]) => value != null) // Filtra null e undefined
    );

    sanitizedFields.updatedAt = new Date().getTime();

    const result = await this.instituteCollection.findOneAndUpdate(
      { _id: instituteId },
      { $set: sanitizedFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new NoItemsFound('Instituto não atualizado');
    }

    return InstituteMongoDTO.fromMongo(result).toEntity();
  }

  async addEventToInstitute(instituteId: string, eventId: string): Promise<void> {
    const result = await this.instituteCollection.findOneAndUpdate(
      { _id: instituteId },
      { $addToSet: { eventsId: eventId } },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new NoItemsFound('institute');
    }
    
  }
}
