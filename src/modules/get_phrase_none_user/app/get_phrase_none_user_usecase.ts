import { IPhraseRepository } from "src/shared/domain/irepositories/phrase_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { IPhrase } from "src/shared/infra/database/models/phrase.model";

export class GetPhraseNoneUserUseCase {
  constructor(private readonly repo: IPhraseRepository) {}

  async execute(): Promise<IPhrase> {
    const phrase = await this.repo.getPhrase();
    if (!phrase) {
      throw new NoItemsFound("phrase");
    }
    return phrase;
  }
}
