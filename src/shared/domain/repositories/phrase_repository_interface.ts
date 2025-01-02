import { IPhrase } from "src/shared/infra/database/models/phrase.model";

export interface IPhraseRepository {
  getPhrase(): Promise<IPhrase | null>;
}
