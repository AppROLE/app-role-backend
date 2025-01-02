import { District } from "../entities/district";

export interface IDistrictRepository {
  getDistrictById(districtId: string): Promise<District | null>;
  createDistrict(district: District): Promise<District>;
}