import {Construct} from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import {Resource, LambdaIntegration, CognitoUserPoolsAuthorizer} from 'aws-cdk-lib/aws-apigateway'
import {Duration} from 'aws-cdk-lib'
import * as path from 'path'
import { envs } from '../../src/shared/helpers/envs/envs'
import { stage } from '../get_stage_env'

export class LambdaStack extends Construct {
  functionsThatNeedCognitoPermissions: lambda.Function[] = []
  functionsThatNeedS3Permissions: lambda.Function[] = []
  lambdaLayer: lambda.LayerVersion
  libLayer: lambda.LayerVersion

  createEventFunction: lambda.Function
  getAllEventsFunction: lambda.Function
  getAllEventsByFilterFunction: lambda.Function
  getEventByIdFunction: lambda.Function
  getTopEventsFunction: lambda.Function
  deleteEventByIdFunction: lambda.Function
  uploadEventPhotoFunction: lambda.Function 
  uploadGalleryEventFunction: lambda.Function
  getAllConfirmedEventsFunction: lambda.Function
  deleteEventPhotoFunction: lambda.Function
  deleteGalleryEventFunction: lambda.Function
  updateEvent: lambda.Function
  uploadEventBannerFunction: lambda.Function

  createReviewFunction: lambda.Function

  createInstituteFunction: lambda.Function
  getAllInstitutesFunction: lambda.Function
  getInstituteByIdFunction: lambda.Function
  getAllInstitutesByPartnerTypeFuntion: lambda.Function
  deleteInstituteByIdFunction: lambda.Function
  uploadInstitutePhotoFunction: lambda.Function
  updateInstituteFunction: lambda.Function

  createDistrictFunction: lambda.Function
  getDistrictByIdFunction: lambda.Function

  getPhrase: lambda.Function

  getAllPresencesByEventIdFunction: lambda.Function
  confirmEventFunction: lambda.Function
  unConfirmEventFunction: lambda.Function

  getAllFavoriteInstitutesFunction: lambda.Function

  createLambdaApiGatewayIntegration(
    moduleName: string, 
    method: string, 
    mssApiResource: Resource, 
    environmentVariables: Record<string, any>, 
    authorizer?: CognitoUserPoolsAuthorizer
  ): lambda.Function {
    const modifiedModuleName = moduleName.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    console.log(`Creating lambda function for ${modifiedModuleName} in stage ${stage}`)
    console.log(`Environment variables for ${modifiedModuleName}: ${JSON.stringify(environmentVariables)}`)
    const lambdaFunction = new lambda.Function(this, modifiedModuleName, {
      functionName: `${modifiedModuleName}-${envs.STACK_NAME}`,
      code: lambda.Code.fromAsset(path.join(__dirname, `../../dist/modules/${moduleName}`)),
      handler: `app/${moduleName}_presenter.lambda_handler`,
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [this.lambdaLayer, this.libLayer],
      environment: environmentVariables,
      timeout: Duration.seconds(30),
      memorySize: 512
    })

    mssApiResource.addResource(moduleName.toLowerCase().replace(/_/g, '-')).addMethod(method, new LambdaIntegration(lambdaFunction), authorizer ? {
      authorizer: authorizer
    } : undefined)

    return lambdaFunction
  }

  constructor(
    scope: Construct, 
    apiGatewayResource: Resource, 
    environmentVariables: Record<string, any>,
    authorizer?: CognitoUserPoolsAuthorizer
  ) {
    super(scope, `${envs.STACK_NAME}-LambdaStack`)

    this.lambdaLayer = new lambda.LayerVersion(this, `${envs.STACK_NAME}-SharedLayer`, {
      code: lambda.Code.fromAsset(path.join(__dirname, '../shared')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
    })

    this.libLayer = new lambda.LayerVersion(this, `${envs.STACK_NAME}-LibLayer`, {
      code: lambda.Code.fromAsset(path.join(__dirname, '../node_dependencies')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
    })

    // event routes
    this.createEventFunction = this.createLambdaApiGatewayIntegration('create_event', 'POST', apiGatewayResource, environmentVariables)
    this.getAllEventsFunction = this.createLambdaApiGatewayIntegration('get_all_events', 'GET', apiGatewayResource, environmentVariables)
    this.getAllEventsByFilterFunction = this.createLambdaApiGatewayIntegration('get_all_events_by_filter', 'GET', apiGatewayResource, environmentVariables)
    this.getEventByIdFunction = this.createLambdaApiGatewayIntegration('get_event_by_id', 'GET', apiGatewayResource, environmentVariables)
    this.deleteEventByIdFunction = this.createLambdaApiGatewayIntegration('delete_event_by_id', 'DELETE', apiGatewayResource, environmentVariables)
    this.uploadEventPhotoFunction = this.createLambdaApiGatewayIntegration('upload_event_photo', 'POST', apiGatewayResource, environmentVariables)
    this.uploadGalleryEventFunction = this.createLambdaApiGatewayIntegration('upload_galery_event', 'POST', apiGatewayResource, environmentVariables)
    this.getTopEventsFunction = this.createLambdaApiGatewayIntegration('get_top_events', 'GET', apiGatewayResource, environmentVariables)
    this.getAllConfirmedEventsFunction = this.createLambdaApiGatewayIntegration('get_all_confirmed_event', 'GET', apiGatewayResource, environmentVariables, authorizer)
    this.deleteEventPhotoFunction = this.createLambdaApiGatewayIntegration('delete_event_photo', 'DELETE', apiGatewayResource, environmentVariables)
    this.updateEvent = this.createLambdaApiGatewayIntegration('update_event', 'PUT', apiGatewayResource, environmentVariables)
    this.deleteGalleryEventFunction = this.createLambdaApiGatewayIntegration('delete_gallery_event', 'DELETE', apiGatewayResource, environmentVariables)
    this.uploadEventBannerFunction = this.createLambdaApiGatewayIntegration('upload_event_banner', 'POST', apiGatewayResource, environmentVariables)

    // review routes
    this.createReviewFunction = this.createLambdaApiGatewayIntegration('create_review', 'POST', apiGatewayResource, environmentVariables, authorizer)

    // institute routes
    this.createInstituteFunction = this.createLambdaApiGatewayIntegration('create_institute', 'POST', apiGatewayResource, environmentVariables)
    this.getAllInstitutesFunction = this.createLambdaApiGatewayIntegration('get_all_institutes', 'GET', apiGatewayResource, environmentVariables)
    this.getInstituteByIdFunction = this.createLambdaApiGatewayIntegration('get_institute_by_id', 'GET', apiGatewayResource, environmentVariables)
    this.deleteInstituteByIdFunction = this.createLambdaApiGatewayIntegration('delete_institute_by_id', 'DELETE', apiGatewayResource, environmentVariables)
    this.getAllInstitutesByPartnerTypeFuntion = this.createLambdaApiGatewayIntegration('get_all_institutes_by_partner_type', 'GET', apiGatewayResource, environmentVariables)
    this.uploadInstitutePhotoFunction = this.createLambdaApiGatewayIntegration('upload_institute_photo', 'POST', apiGatewayResource, environmentVariables)
    this.updateInstituteFunction = this.createLambdaApiGatewayIntegration('update_institute', 'PUT', apiGatewayResource, environmentVariables)
    this.getAllFavoriteInstitutesFunction = this.createLambdaApiGatewayIntegration('get_all_favorite_institutes', 'GET', apiGatewayResource, environmentVariables, authorizer)

    this.getPhrase = this.createLambdaApiGatewayIntegration('get_phrase', 'GET', apiGatewayResource, environmentVariables, authorizer)

    // presence routes
    this.getAllPresencesByEventIdFunction = this.createLambdaApiGatewayIntegration('get_all_presences_by_event_id', 'GET', apiGatewayResource, environmentVariables, authorizer)
    this.confirmEventFunction = this.createLambdaApiGatewayIntegration('confirm_event', 'POST', apiGatewayResource, environmentVariables, authorizer)
    this.unConfirmEventFunction = this.createLambdaApiGatewayIntegration('unconfirm_event', 'POST', apiGatewayResource, environmentVariables, authorizer)


    // district routes
    this.createDistrictFunction = this.createLambdaApiGatewayIntegration('create_district', 'POST', apiGatewayResource, environmentVariables, authorizer)
    this.getDistrictByIdFunction = this.createLambdaApiGatewayIntegration('get_district_by_id', 'GET', apiGatewayResource, environmentVariables, authorizer)

    this.functionsThatNeedS3Permissions = [
      this.uploadEventPhotoFunction,
      this.uploadInstitutePhotoFunction,
      this.uploadEventBannerFunction,
      this.deleteEventPhotoFunction,
      this.deleteEventByIdFunction,
      this.deleteInstituteByIdFunction,
      this.deleteGalleryEventFunction
    ]

    this.functionsThatNeedCognitoPermissions = [
      this.createReviewFunction,
      this.getAllConfirmedEventsFunction
    ]
  }
}