import { IInvalidationRepository } from "src/shared/domain/irepositories/invalidation_repository_interface";
import { 
  CloudFrontClient, 
  CreateInvalidationCommandInput, 
  CreateInvalidationCommand 
} from '@aws-sdk/client-cloudfront'
import { Environments } from "src/shared/environments";

export class InvalidationRepositoryCloudfront implements IInvalidationRepository {
  cloudfrontClient: CloudFrontClient
  
  constructor() {
    this.cloudfrontClient = new CloudFrontClient({
      region: Environments.getEnvs().region,
    })
  }

  async createGlobalInvalidation(): Promise<void> {
    try {
      const timestamp = new Date().getTime().toString()
      const params: CreateInvalidationCommandInput = {
        DistributionId: Environments.getEnvs().cloudFrontId,
        InvalidationBatch: {
          CallerReference: `invalidation-${timestamp}`,
          Paths: {
            Quantity: 1,
            Items: ['/*']
          }
        }
      }

      const resp = await this.cloudfrontClient.send(new CreateInvalidationCommand(params))

      console.log(`Response from createGlobalInvalidation: ${resp}`)

    } catch (error: any) {
      throw new Error(`InvalidationRepositoryCloudfront, Error on createGlobalInvalidation: ${error.message}`)
    }
  } 
}