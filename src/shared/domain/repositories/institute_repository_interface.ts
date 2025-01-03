import { LocationProps } from "../entities/event";
import { Institute } from "../entities/institute";
import { INSTITUTE_TYPE } from "../enums/institute_type_enum";
import { PARTNER_TYPE } from "../enums/partner_type_enum";

export interface IInstituteRepository {
  createInstitute(institute: Institute): Promise<string>;
  getAllInstitutes(): Promise<Institute[]>;
  getAllInstitutesByPartnerType(
    partnerType: PARTNER_TYPE
  ): Promise<Institute[]>;
  getInstituteById(instituteId: string): Promise<Institute>;
  deleteInstituteById(instituteId: string): Promise<void>;
  updateInstitutePhoto(name: string, institutePhoto: string): Promise<string>;
  updateInstitute(
    institute_id: string,
    description?: string,
    institute_type?: INSTITUTE_TYPE,
    partner_type?: PARTNER_TYPE,
    name?: string,
    location?: LocationProps,
    phone?: string
  ): Promise<Institute>;
}
