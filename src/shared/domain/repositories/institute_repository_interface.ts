import { PaginationReturn } from 'src/shared/helpers/types/event_pagination';
import { Institute } from '../entities/institute';
import { PARTNER_TYPE } from '../enums/partner_type_enum';

export interface IInstituteRepository {
  createInstitute(institute: Institute): Promise<Institute>;
  getAllInstitutesPaginated(page: number): Promise<PaginationReturn<Institute>>;
  getInstitutesByFilter(
    page: number,
    filter: any
  ): Promise<PaginationReturn<Institute>>;
  getInstituteById(instituteId: string): Promise<Institute | null>;
  deleteInstituteById(instituteId: string): Promise<void>;
  updateInstitute(
    instituteId: string,
    updatedFields: Partial<Institute>
  ): Promise<Institute>;
  addEventToInstitute(instituteId: string, eventId: string): Promise<void>;
}
