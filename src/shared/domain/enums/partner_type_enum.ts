export enum PARTNER_TYPE {
    GLOBAL_PARTNER = "GLOBAL_PARTNER",
    PROMOTER_PARTNER = "PROMOTER_PARTNER",
    NO_PARTNER = "NO_PARTNER"
}

export function toEnumPartnerType(partner_type: string){
    switch(partner_type) {
        case "GLOBAL_PARTNER":
            return PARTNER_TYPE.GLOBAL_PARTNER;
        case "PROMOTER_PARTNER":
            return PARTNER_TYPE.PROMOTER_PARTNER;
        case "NO_PARTNER":
            return PARTNER_TYPE.NO_PARTNER;
        default:
            throw new Error("Invalid partner type");
    }
}