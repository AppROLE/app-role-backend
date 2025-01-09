import { Address } from "../entities/address";
import { Institute } from "../entities/institute";
import { INSTITUTE_TYPE } from "../enums/institute_type_enum";
import { PARTNER_TYPE } from "../enums/partner_type_enum";

export interface IInstituteRepository {
  createInstitute(institute: Institute): Promise<Institute>;
  getAllInstitutes(): Promise<Institute[]>;
  getAllInstitutesByPartnerType(
    partnerType: PARTNER_TYPE
  ): Promise<Institute[]>;
  getInstituteById(instituteId: string): Promise<Institute | null>;
  getInstitutesByIds(institutesId: string[]): Promise<Institute[]>;
  deleteInstituteById(instituteId: string): Promise<void>;
  updateInstitute(
    instituteId: string,
    description?: string,
    institute_type?: INSTITUTE_TYPE,
    partner_type?: PARTNER_TYPE,
    name?: string,
    address?: Address,
    phone?: string
  ): Promise<Institute>;
}
