import { Institute } from "src/shared/domain/entities/institute";

export class GetAllFavoriteInstitutesViewModel {
    private institutes: {
        instituteId: string;
        name: string;
        logoPhoto: string;
        description: string;
    }[];

    constructor(institutes: Institute[]) {
        this.institutes = institutes.map((institute) => ({
            instituteId: institute.instituteId ?? '',
            name: institute.instituteName,
            logoPhoto: institute.instituteLogoPhoto ?? '',
            description: institute.instituteDescription
        }));
    }

    toJSON() {
        return this.institutes;
    }
}
