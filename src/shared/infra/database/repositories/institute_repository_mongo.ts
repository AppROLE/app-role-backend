import { Institute } from "../../../domain/entities/institute";
import { IInstituteRepository } from "../../../domain/repositories/institute_repository_interface";
import { IInstitute } from "../models/institute.model";
import { InstituteMongoDTO } from "../dtos/institute_mongo_dto";
import {
  NoItemsFound,
  DuplicatedItem,
} from "../../../../../src/shared/helpers/errors/usecase_errors";
import { Collection, Connection } from "mongoose";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { INSTITUTE_TYPE } from "src/shared/domain/enums/institute_type_enum";
import { LocationProps } from "src/shared/domain/entities/event";

export class InstituteRepositoryMongo implements IInstituteRepository {
  private instituteCollection: Collection<IInstitute>;

  constructor(connection: Connection) {
    this.instituteCollection = connection.collection<IInstitute>("Institute");
  }

  async createInstitute(institute: Institute): Promise<Institute> {
    const dto = InstituteMongoDTO.fromEntity(institute);
    const instituteDoc = InstituteMongoDTO.toMongo(dto);

    const existingInstitute = await this.instituteCollection.findOne({
      name: instituteDoc.name,
    });
    if (existingInstitute) {
      throw new DuplicatedItem("name");
    }

    const result = await this.instituteCollection.insertOne(instituteDoc);
    if (!result.acknowledged) {
      throw new Error("Failed to create institute in MongoDB.");
    }

    return institute;
  }

  async getInstituteById(instituteId: string): Promise<Institute> {
    const instituteDoc = await this.instituteCollection
      .aggregate([
        { $match: { _id: instituteId } },
        {
          $lookup: {
            from: "Event",
            localField: "events",
            foreignField: "_id",
            as: "eventsDetails",
          },
        },
      ])
      .toArray();

    if (!instituteDoc || instituteDoc.length === 0) {
      throw new NoItemsFound("institute");
    }

    return InstituteMongoDTO.toEntity(
      InstituteMongoDTO.fromMongo(instituteDoc[0])
    );
  }

  async getAllInstitutes(): Promise<Institute[]> {
    const instituteDocs = await this.instituteCollection.find().toArray();

    if (!instituteDocs || instituteDocs.length === 0) {
      throw new NoItemsFound("institutes");
    }

    return instituteDocs.map((doc) =>
      InstituteMongoDTO.toEntity(InstituteMongoDTO.fromMongo(doc))
    );
  }

  async deleteInstituteById(instituteId: string): Promise<void> {
    await this.instituteCollection.deleteOne({ _id: instituteId });
  }

  async getAllInstitutesByPartnerType(
    partnerType: PARTNER_TYPE
  ): Promise<Institute[]> {
    const instituteDocs = await this.instituteCollection
      .find({ partner_type: partnerType })
      .toArray();

    if (!instituteDocs || instituteDocs.length === 0) {
      throw new NoItemsFound("institutes");
    }

    return instituteDocs.map((doc) =>
      InstituteMongoDTO.toEntity(InstituteMongoDTO.fromMongo(doc))
    );
  }

  async updateInstitutePhoto(
    instituteId: string,
    institutePhoto: string
  ): Promise<string> {
    const result = await this.instituteCollection.updateOne(
      { _id: instituteId },
      { $set: { logo_photo: institutePhoto } }
    );

    if (!result.modifiedCount) {
      throw new Error("Failed to update institute photo.");
    }

    return institutePhoto;
  }
  async updateInstitute(
    instituteId: string,
    description?: string,
    institute_type?: INSTITUTE_TYPE,
    partner_type?: PARTNER_TYPE,
    name?: string,
    location?: LocationProps,
    phone?: string
  ): Promise<Institute> {
    const updateFields: Partial<IInstitute> = {};

    if (description) updateFields.description = description;
    if (institute_type) updateFields.institute_type = institute_type;
    if (partner_type) updateFields.partner_type = partner_type;
    if (name) updateFields.name = name;
    if (location) updateFields.location = location;
    if (phone) updateFields.phone = phone;

    const updatedInstitute = await this.instituteCollection.findOneAndUpdate(
      { _id: instituteId },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!updatedInstitute) {
      throw new NoItemsFound("institute");
    }

    return InstituteMongoDTO.toEntity(
      InstituteMongoDTO.fromMongo(updatedInstitute)
    );
  }
}
