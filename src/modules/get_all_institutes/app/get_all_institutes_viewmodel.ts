import { INSTITUTE_TYPE } from 'src/shared/domain/enums/institute_type_enum';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';
import { Institute } from 'src/shared/domain/entities/institute';
import { Address } from 'src/shared/domain/entities/address';

export class InstituteViewModel {
  private instituteId?: string;
  private name: string;
  private logoPhoto?: string;
  private description: string;
  private institute_type: INSTITUTE_TYPE;
  private partner_type: PARTNER_TYPE;
  private address: Address;
  private price?: number;
  private photosUrl?: string[];
  private eventsId?: string[];

  constructor(institute: Institute) {
    this.instituteId = institute.instituteId;
    this.name = institute.name;
    this.logoPhoto = institute.logoPhoto;
    this.description = institute.description;
    this.institute_type = institute.instituteType;
    this.partner_type = institute.partnerType;
    this.address = institute.address;
    this.price = institute.price;
    this.photosUrl = institute.photosUrl;
    this.eventsId = institute.eventsId;
  }

  toJSON() {
    return {
      instituteId: this.instituteId,
      name: this.name,
      logoPhoto: this.logoPhoto,
      description: this.description,
      instituteType: this.institute_type,
      partnerType: this.partner_type,
      address: this.address,
      price: this.price,
      photosUrl: this.photosUrl,
      eventsId: this.eventsId,
    };
  }
}

export class GetAllInstitutesViewModel {
  private institutes: InstituteViewModel[];

  constructor(institutes: Institute[]) {
    if (!institutes) {
      throw new Error('Institutes array must not be undefined');
    }

    this.institutes = institutes.map(
      (institute) => new InstituteViewModel(institute)
    );
  }

  toJSON() {
    return {
      institutes: this.institutes.map((institute) => institute.toJSON()),
      message: 'All institutes have been retrieved successfully',
    };
  }
}
