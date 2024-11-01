import { Institute } from "src/shared/domain/entities/institute";

export class GetAllFavoriteInstitutesViewModel {
    private institutes: {
        institute_id: string;
        name: string;
        logo_photo: string;
        description: string;
    }[];

    constructor(institutes: Institute[]) {
        this.institutes = institutes.map((institute) => ({
            institute_id: institute.instituteId ?? '',
            name: institute.instituteName,
            logo_photo: institute.instituteLogoPhoto ?? '',
            description: institute.instituteDescription
        }));
    }

    toJSON() {
        return this.institutes;
    }
}
