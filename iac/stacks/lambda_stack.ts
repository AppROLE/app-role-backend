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
  deleteEventByIdFunction: lambda.Function
  uploadEventPhotoFunction: lambda.Function 

  createInstituteFunction: lambda.Function
  getAllInstitutesFunction: lambda.Function
  getInstituteByIdFunction: lambda.Function
  getAllInstitutesByPartnerTypeFuntion: lambda.Function
  deleteInstituteByIdFunction: lambda.Function

  getPhrase: lambda.Function

  getAllPresencesByEventIdFunction: lambda.Function
  confirmEventFunction: lambda.Function

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

    // auth routes
    this.createEventFunction = this.createLambdaApiGatewayIntegration('create_event', 'POST', apiGatewayResource, environmentVariables)
    this.getAllEventsFunction = this.createLambdaApiGatewayIntegration('get_all_events', 'GET', apiGatewayResource, environmentVariables)
    this.getAllEventsByFilterFunction = this.createLambdaApiGatewayIntegration('get_all_events_by_filter', 'POST', apiGatewayResource, environmentVariables)
    this.getEventByIdFunction = this.createLambdaApiGatewayIntegration('get_event_by_id', 'GET', apiGatewayResource, environmentVariables)
    this.deleteEventByIdFunction = this.createLambdaApiGatewayIntegration('delete_event_by_id', 'DELETE', apiGatewayResource, environmentVariables)
    this.uploadEventPhotoFunction = this.createLambdaApiGatewayIntegration('upload_event_photo', 'POST', apiGatewayResource, environmentVariables)

    // institute routes
    this.createInstituteFunction = this.createLambdaApiGatewayIntegration('create_institute', 'POST', apiGatewayResource, environmentVariables)
    this.getAllInstitutesFunction = this.createLambdaApiGatewayIntegration('get_all_institutes', 'GET', apiGatewayResource, environmentVariables)
    this.getInstituteByIdFunction = this.createLambdaApiGatewayIntegration('get_institute_by_id', 'GET', apiGatewayResource, environmentVariables, authorizer)
    this.deleteInstituteByIdFunction = this.createLambdaApiGatewayIntegration('delete_institute_by_id', 'DELETE', apiGatewayResource, environmentVariables)
    this.getAllInstitutesByPartnerTypeFuntion = this.createLambdaApiGatewayIntegration('get_all_institutes_by_partner_type', 'GET', apiGatewayResource, environmentVariables)

    this.getPhrase = this.createLambdaApiGatewayIntegration('get_phrase', 'GET', apiGatewayResource, environmentVariables)

    // presence routes
    this.getAllPresencesByEventIdFunction = this.createLambdaApiGatewayIntegration('get_all_presences_by_event_id', 'GET', apiGatewayResource, environmentVariables, authorizer)
    this.confirmEventFunction = this.createLambdaApiGatewayIntegration('confirm_event', 'POST', apiGatewayResource, environmentVariables, authorizer)

    this.functionsThatNeedS3Permissions = [
      this.uploadEventPhotoFunction
    ]

    this.functionsThatNeedCognitoPermissions = [
      // this.signUpFunction,
    ]
  }
}