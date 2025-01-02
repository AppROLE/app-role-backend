import { District } from "src/shared/domain/entities/district";
import { IDistrictRepository } from "src/shared/domain/repositories/district_repository_interface";
import { IDistrict } from "../models/district_model";
import { DistrictMongoDTO } from "../dtos/district_mongo_dto";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Collection, Connection } from "mongoose";

export class DistrictRepositoryMongo implements IDistrictRepository {
  private districtCollection: Collection<IDistrict>;

  constructor(connection: Connection) {
    this.districtCollection = connection.collection<IDistrict>("District");
  }

  async createDistrict(district: District): Promise<District> {
    const dto = DistrictMongoDTO.fromEntity(district);
    const districtDoc = DistrictMongoDTO.toMongo(dto);

    const result = await this.districtCollection.insertOne(districtDoc);
    if (!result.acknowledged) {
      throw new Error("Failed to create district in MongoDB.");
    }

    return district;
  }

  async getDistrictById(districtId: string): Promise<District | null> {
    const districtDoc = await this.districtCollection.findOne({
      _id: districtId,
    });

    if (!districtDoc) {
      throw new NoItemsFound("district");
    }

    const districtDto = DistrictMongoDTO.fromMongo(districtDoc);
    return DistrictMongoDTO.toEntity(districtDto);
  }
}
