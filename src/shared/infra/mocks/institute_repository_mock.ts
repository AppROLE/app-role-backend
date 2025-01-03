import { InstituteMock } from "src/shared/domain/mocks/institute_mock";
import { Institute } from "../../domain/entities/institute";
import { IInstituteRepository } from "../../domain/repositories/institute_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { PARTNER_TYPE } from "src/shared/domain/enums/partner_type_enum";
import { INSTITUTE_TYPE } from "src/shared/domain/enums/institute_type_enum";
import { LocationProps } from "src/shared/domain/entities/event";

export class InstituteRepositoryMock implements IInstituteRepository {
  private institutes: Institute[];

  constructor() {
    const instituteMock = new InstituteMock();
    this.institutes = instituteMock.institutes;
  }
  updateInstituteV2(
    instituteId: string,
    updatedFields: any
  ): Promise<Institute> {
    throw new Error("Method not implemented.");
  }
  updateInstitutePhoto(name: string, institutePhoto: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  createInstitute(institute: Institute): Promise<string> {
    this.institutes.push(institute);
    if (!institute.instituteId) {
      throw new Error("Institute ID is undefined");
    }
    return Promise.resolve(institute.instituteId);
  }

  getInstituteById(instituteId: string): Promise<Institute> {
    const institute = this.institutes.find(
      (institute) => institute.instituteId === instituteId
    );
    if (!institute) {
      throw new NoItemsFound("institute");
    }
    return Promise.resolve(institute);
  }

  async getAllInstitutes(): Promise<Institute[]> {
    return [...this.institutes];
  }

  async getAllInstitutesByPartnerType(
    partnerType: PARTNER_TYPE
  ): Promise<Institute[]> {
    const institutes = this.institutes.filter(
      (institute) => institute.institutePartnerType === partnerType
    );
    return institutes;
  }

  async deleteInstituteById(instituteId: string): Promise<void> {
    const eventIndex = this.institutes.findIndex(
      (institute) => institute.instituteId === instituteId
    );

    if (eventIndex === -1) {
      throw new NoItemsFound("event");
    }

    this.institutes.splice(eventIndex, 1);

    return Promise.resolve();
  }

  async updateInstitute(
    institute_id: string,
    description?: string,
    institute_type?: INSTITUTE_TYPE,
    partner_type?: PARTNER_TYPE,
    name?: string,
    location?: LocationProps,
    phone?: string
  ): Promise<Institute> {
    const institute = this.institutes.find(
      (institute) => institute.instituteId === institute_id
    );
    if (!institute) {
      throw new NoItemsFound("institute");
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
    if (location) {
      institute.instituteLocation = location;
    }
    if (phone) {
      institute.institutePhone = phone;
    }

    return Promise.resolve(institute);
  }
}
