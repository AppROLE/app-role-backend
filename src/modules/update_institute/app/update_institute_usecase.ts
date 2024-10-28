import { Institute } from "src/shared/domain/entities/institute";
import { INSTITUTE_TYPE } from "src/shared/domain/enums/institute_type_enum";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { IInstituteRepository } from "src/shared/domain/irepositories/institute_repository_interface";

export class UpdateInstituteUseCase {
    constructor(private readonly repo: IInstituteRepository) {}

    async execute(
        institute_id: string,
        description?: string,
        institute_type?: INSTITUTE_TYPE,
        partner_type?: PARTNER_TYPE,
        name?: string,
        address?: string,
        district_id?: string,
        phone?: string
    ) {
        const institute: {
            instituteId: string;
            instituteDescription?: string;
            instituteInstituteType?: INSTITUTE_TYPE;
            institutePartnerType?: PARTNER_TYPE;
            instituteName?: string;
            instituteAddress?: string;
            instituteDistrictId?: string;
            institutePrice?: number;
            institutePhone?: string;
        } = {
            instituteId: institute_id,
        }
        if (description) {
            institute.instituteDescription = description;
        }
        if (institute_type) {
            institute.instituteInstituteType = institute_type;
        }
        if (partner_type) {
            institute.institutePartnerType = partner_type;
        }
        if (name) {
            institute.instituteName = name;
        }
        if (address) {
            institute.instituteAddress = address;
        }
        if (district_id) {
            institute.instituteDistrictId = district_id;
        }
        if (phone) {
            institute.institutePhone = phone;
        }

        await this.repo.updateInstitute(
            institute.instituteId,
            institute.instituteDescription,
            institute.instituteInstituteType,
            institute.institutePartnerType,
            institute.instituteName,
            institute.instituteAddress,
            institute.instituteDistrictId,
            institute.institutePhone
        );

    }
}