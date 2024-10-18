import { Institute } from "../entities/institute";
import { PARTNER_TYPE } from "../enums/partner_type_enum";

export interface IInstituteRepository {
  createInstitute(institute: Institute): Promise<Institute>;
  getAllInstitutes(): Promise<Institute[]>;
  getAllInstitutesByPartnerType(partnerType: PARTNER_TYPE): Promise<Institute[]>;
  getInstituteById(instituteId: string): Promise<Institute>;
  deleteInstituteById(instituteId: string): Promise<void>;
  updateInstitutePhoto(name: string, institutePhoto: string): Promise<string>;
  updateInstitute(institute: Institute): Promise<void>;
}