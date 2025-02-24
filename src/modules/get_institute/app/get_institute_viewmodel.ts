import { Address } from 'src/shared/domain/entities/address';
import { Institute } from 'src/shared/domain/entities/institute';
import { INSTITUTE_TYPE } from 'src/shared/domain/enums/institute_type_enum';
import { PARTNER_TYPE } from 'src/shared/domain/enums/partner_type_enum';

export class GetInstituteViewmodel {
  private instituteId?: string;
  private name: string;
  private logo?: string;
  private description: string;
  private instituteType: INSTITUTE_TYPE;
  private partnerType: PARTNER_TYPE;
  private phone?: string;
  private address: Address;
  private price?: number;
  private rating?: number;
  private photosUrl?: string[];
  private eventsId?: string[];
  private reviewsId?: string[];

  constructor(institute: Institute) {
    this.instituteId = institute.instituteId;
    this.name = institute.name;
    this.logo = institute.logo;
    this.description = institute.description;
    this.instituteType = institute.instituteType;
    this.partnerType = institute.partnerType;
    this.phone = institute.phone;
    this.address = institute.address;
    this.price = institute.price;
    this.rating = institute.rating;
    this.eventsId = institute.eventsId;
    this.reviewsId = institute.reviewsId;
  }

  toJSON() {
    return {
      instituteId: this.instituteId,
      name: this.name,
      logo: this.logo,
      description: this.description,
      instituteType: this.instituteType,
      partnerType: this.partnerType,
      phone: this.phone,
      address: this.address,
      price: this.price,
      photosUrl: this.photosUrl,
      rating: this.rating,
      eventsId: this.eventsId,
      reviewsId: this.reviewsId,
    };
  }
}

export class GetAllInstitutesByPartnerTypeViewModel {
  private institutes: GetInstituteViewmodel[];

  constructor(institutes: Institute[]) {
    if (!institutes) {
      throw new Error('Institutes array must not be undefined');
    }

    this.institutes = institutes.map(
      (institute) => new GetInstituteViewmodel(institute)
    );
  }

  toJSON() {
    return {
      institutes: this.institutes.map((institute) => institute.toJSON()),
      message: 'All institutes have been retrieved successfully',
    };
  }
}
