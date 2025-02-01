import { Institute } from '../../../domain/entities/institute';
import { IInstituteRepository } from '../../../domain/repositories/institute_repository_interface';
import { InstituteModel } from '../models/institute.model';
import { InstituteMongoDTO } from '../dtos/institute_mongo_dto';
import { NoItemsFound } from '../../../../../src/shared/helpers/errors/errors';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';
import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';

export class InstituteRepositoryMongo implements IInstituteRepository {
  async createInstitute(institute: Institute): Promise<Institute> {
    const instituteDoc = InstituteMongoDTO.fromEntity(institute).toMongo();
    const result = await InstituteModel.create(instituteDoc);
    return InstituteMongoDTO.fromMongo(result).toEntity();
  }

  async getInstituteById(instituteId: string): Promise<Institute | null> {
    const instituteDoc = await InstituteModel.findById(instituteId).lean();
    return instituteDoc
      ? InstituteMongoDTO.fromMongo(instituteDoc).toEntity()
      : null;
  }

  async getAllInstitutesPaginated(
    page: number
  ): Promise<PaginationReturn<Institute>> {
    const limit = 30;
    const skip = (page - 1) * limit;

    const [institutes, totalCount] = await Promise.all([
      InstituteModel.find().sort({ name: 1 }).skip(skip).limit(limit).lean(),
      InstituteModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: institutes.map((doc) =>
        InstituteMongoDTO.fromMongo(doc).toEntity()
      ),
      totalPages,
      totalCount,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async deleteInstituteById(instituteId: string): Promise<void> {
    const result = await InstituteModel.deleteOne({ _id: instituteId });
    if (result.deletedCount === 0) {
      throw new NoItemsFound('institute');
    }
  }

  async getInstitutesByFilter(
    page: number,
    filter: any
  ): Promise<PaginationReturn<Institute>> {
    const limit = 30;
    const skip = (page - 1) * limit;

    const [institutes, totalCount] = await Promise.all([
      InstituteModel.find(filter || {})
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      InstituteModel.countDocuments(filter || {}),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: institutes.map((doc) =>
        InstituteMongoDTO.fromMongo(doc).toEntity()
      ),
      totalPages,
      totalCount,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
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

  async addEventToInstitute(
    instituteId: string,
    eventId: string
  ): Promise<void> {
    const result = await InstituteModel.updateOne(
      { _id: instituteId },
      { $addToSet: { eventsId: eventId } }
    );
    if (!result.modifiedCount) {
      throw new NoItemsFound('institute');
    }
  }
}
