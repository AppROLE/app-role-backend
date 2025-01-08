import { Institute } from "../entities/institute";
import { INSTITUTE_TYPE } from "../enums/institute_type_enum";
import { PARTNER_TYPE } from "../enums/partner_type_enum";

export class InstituteMock {
  public institutes: Institute[];

  constructor() {
    this.institutes = [
      new Institute({
        name: "Galleria Club",
        address: {
          address: "123 Main St",
          number: 123,
          cep: "12345-678",
          city: "City",
          neighborhood: "Neighborhood",
          state: "State",
          latitude: 0,
          longitude: 0,
        },
        partnerType: PARTNER_TYPE.NO_PARTNER,
        description: "A melhor balada de São Paulo",
        instituteType: INSTITUTE_TYPE.ESTABELECIMENTO_FIXO,
        logoPhoto: "https://example.com/galleria_club_logo.jpg",
      }),
      new Institute({
        name: "Galleria Club",
        address: {
          address: "123 Main St",
          number: 123,
          cep: "12345-678",
          city: "City",
          neighborhood: "Neighborhood",
          state: "State",
          latitude: 0,
          longitude: 0,
        },
        partnerType: PARTNER_TYPE.PROMOTER_PARTNER,
        description: "A melhor balada de São Paulo",
        instituteType: INSTITUTE_TYPE.AGENCIA_DE_FESTAS,
        logoPhoto: "https://example.com/galleria_club_logo.jpg",
      }),
      new Institute({
        name: "Galleria Club",
        address: {
          address: "123 Main St",
          number: 123,
          cep: "12345-678",
          city: "City",
          neighborhood: "Neighborhood",
          state: "State",
          latitude: 0,
          longitude: 0,
        },
        partnerType: PARTNER_TYPE.GLOBAL_PARTNER,
        description: "A melhor balada de São Paulo",
        instituteType: INSTITUTE_TYPE.ESTABELECIMENTO_FIXO,
        logoPhoto: "https://example.com/galleria_club_logo.jpg",
      }),
    ];
  }
}
