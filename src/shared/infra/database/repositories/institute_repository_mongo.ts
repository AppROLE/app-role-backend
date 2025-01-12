import { Institute } from '../../../domain/entities/institute';
import { IInstituteRepository } from '../../../domain/repositories/institute_repository_interface';
import { InstituteModel } from '../models/institute.model';
import { InstituteMongoDTO } from '../dtos/institute_mongo_dto';
import { NoItemsFound } from '../../../../../src/shared/helpers/errors/errors';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';

export class InstituteRepositoryMongo implements IInstituteRepository {
  async createInstitute(institute: Institute): Promise<Institute> {
    const instituteDoc = InstituteMongoDTO.fromEntity(institute).toMongo();
    const result = await InstituteModel.create(instituteDoc);
    return InstituteMongoDTO.fromMongo(result).toEntity();
  }

  async getInstituteById(instituteId: string): Promise<Institute | null> {
    const instituteDoc = await InstituteModel.findById(instituteId).lean();
    return instituteDoc ? InstituteMongoDTO.fromMongo(instituteDoc).toEntity() : null;
  }

  async getAllInstitutes(): Promise<Institute[]> {
    const instituteDocs = await InstituteModel.find().lean();
    if (!instituteDocs.length) {
      throw new NoItemsFound('institutes');
    }
    return instituteDocs.map((doc) => InstituteMongoDTO.fromMongo(doc).toEntity());
  }

  async getInstitutesByIds(institutesId: string[]): Promise<Institute[]> {
    const instituteDocs = await InstituteModel.find({ _id: { $in: institutesId } }).lean();
    return instituteDocs.map((doc) => InstituteMongoDTO.fromMongo(doc).toEntity());
  }

  async deleteInstituteById(instituteId: string): Promise<void> {
    const result = await InstituteModel.deleteOne({ _id: instituteId });
    if (result.deletedCount === 0) {
      throw new NoItemsFound('institute');
    }
  }

  async getAllInstitutesByPartnerType(partnerType: PARTNER_TYPE): Promise<Institute[]> {
    const instituteDocs = await InstituteModel.find({ partnerType }).lean();
    return instituteDocs.map((doc) => InstituteMongoDTO.fromMongo(doc).toEntity());
  }

  async updateInstitute(
    instituteId: string,
    updatedFields: Partial<Institute>
  ): Promise<Institute> {
    const sanitizedFields = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, value]) => value != null)
    );

    sanitizedFields.updatedAt = new Date() as any;

    const result = await InstituteModel.findByIdAndUpdate(
      instituteId,
      { $set: sanitizedFields },
      { new: true }
    ).lean();

    if (!result) {
      throw new NoItemsFound('Instituto não atualizado');
    }

    return InstituteMongoDTO.fromMongo(result).toEntity();
  }

  async addEventToInstitute(instituteId: string, eventId: string): Promise<void> {
    const result = await InstituteModel.updateOne(
      { _id: instituteId },
      { $addToSet: { eventsId: eventId } }
    );
    if (!result.modifiedCount) {
      throw new NoItemsFound('institute');
    }
  }
}
