import { IPhrase } from "../models/phrase.model";
import { IPhraseRepository } from "../../../domain/repositories/phrase_repository_interface";
import { NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { Collection, Connection } from "mongoose";

export class PhraseRepositoryMongo implements IPhraseRepository {
  private phraseCollection: Collection<IPhrase>;

  constructor(connection: Connection) {
    this.phraseCollection = connection.collection<IPhrase>("phrase");
  }

  async getPhrase(): Promise<IPhrase> {
    const randomPhrase = await this.phraseCollection
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();

    if (!randomPhrase || randomPhrase.length === 0) {
      throw new NoItemsFound("phrase in db");
    }

    return randomPhrase[0] as IPhrase;
  }
}
