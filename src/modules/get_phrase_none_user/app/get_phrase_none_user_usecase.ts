import { IPhraseRepository } from "src/shared/domain/repositories/phrase_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { IPhrase } from "src/shared/infra/database/models/phrase.model";
import { Repository } from "src/shared/infra/database/repositories/repository";

export class GetPhraseNoneUserUseCase {
  repository: Repository;
  private readonly phrase_repo: IPhraseRepository;

  constructor() {
    this.repository = new Repository({
      phrase_repo: true,
    });
    this.phrase_repo = this.repository.phrase_repo!;
  }

  async execute(): Promise<IPhrase> {
    const phrase = await this.phrase_repo.getPhrase();
    if (!phrase) {
      throw new NoItemsFound("phrase");
    }
    return phrase;
  }
}
