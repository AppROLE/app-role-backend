export interface IInvalidationRepository {
  createGlobalInvalidation(): Promise<void>;
}