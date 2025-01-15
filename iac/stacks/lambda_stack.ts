import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  Resource,
  LambdaIntegration,
  CognitoUserPoolsAuthorizer,
} from 'aws-cdk-lib/aws-apigateway';
import { Duration } from 'aws-cdk-lib';
import * as path from 'path';

export class LambdaStack extends Construct {
  functionsThatNeedCognitoPermissions: lambda.Function[] = [];
  functionsThatNeedS3Permissions: lambda.Function[] = [];
  functionsThatNeedSESPermissions: lambda.Function[] = [];
  lambdaLayer: lambda.LayerVersion;
  libLayer: lambda.LayerVersion;

  // auth routes
  confirmForgotPasswordFunction: lambda.Function;
  forgotPasswordFunction: lambda.Function;
  refreshTokenFunction: lambda.Function;
  resendCodeFunction: lambda.Function;
  signInFunction: lambda.Function;
  signUpFunction: lambda.Function;
  verifyEmailFunction: lambda.Function;

  // profile routes
  favoriteInstituteFunction: lambda.Function;
  unfavoriteInstituteFunction: lambda.Function;
  getMyProfileFunction: lambda.Function;
  createProfileFunction: lambda.Function;
  updateProfileFunction: lambda.Function;
  getOtherProfileFunction: lambda.Function;
  getMyFollowingFunction: lambda.Function;
  getMyFollowersFunction: lambda.Function;
  getMyConfirmedEventsFunction: lambda.Function;
  getMyHistoricEventsFunction: lambda.Function;
  getOtherFollowingFunction: lambda.Function;
  getOtherFollowersFunction: lambda.Function;
  validateUsernameFunction: lambda.Function;
  searchProfilesFunction: lambda.Function;

  // institute routes
  createInstituteFunction: lambda.Function;
  deleteInstituteFunction: lambda.Function;
  getInstituteFunction: lambda.Function;
  getAllInstitutesFunction: lambda.Function;
  getAllInstitutesByPartnerTypeFunction: lambda.Function;
  updateInstituteFunction: lambda.Function;

  // event routes
  createPresenceFunction: lambda.Function;
  createEventFunction: lambda.Function;
  deleteEventFunction: lambda.Function;
  getEventFunction: lambda.Function;
  getAllEventsFunction: lambda.Function;
  getAllEventsByFilterFunction: lambda.Function;
  getAllPresencesByEventIdFunction: lambda.Function;
  getTopEventsFunction: lambda.Function;
  deletePresenceFunction: lambda.Function;
  updateEventFunction: lambda.Function;

  // review routes
  createReviewFunction: lambda.Function;

  createLambdaApiGatewayIntegration(
    moduleName: string,
    method: string,
    mssApiResource: Resource,
    environmentVariables: Record<string, any>,
    authorizer?: CognitoUserPoolsAuthorizer
  ): lambda.Function {
    const stackName = process.env.STACK_NAME as string;
    const lambdaFunction = new lambda.Function(this, moduleName, {
      functionName: `${stackName}-${moduleName}`,
      code: lambda.Code.fromAsset(
        path.join(__dirname, `../../dist/modules/${moduleName}`)
      ),
      handler: `app/${moduleName}_presenter.lambda_handler`,
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [this.lambdaLayer, this.libLayer],
      environment: environmentVariables,
      timeout: Duration.seconds(30),
      memorySize: 512,
    });

    mssApiResource
      .addResource(moduleName.toLowerCase().replace(/_/g, '-'))
      .addMethod(
        method,
        new LambdaIntegration(lambdaFunction),
        authorizer
          ? {
              authorizer: authorizer,
            }
          : undefined
      );

    return lambdaFunction;
  }

  constructor(
    scope: Construct,
    apiGatewayResource: Resource,
    environmentVariables: Record<string, any>,
    authorizer?: CognitoUserPoolsAuthorizer
  ) {
    const stackName = process.env.STACK_NAME as string;
    super(scope, `${stackName}-LambdaStack`);

    this.lambdaLayer = new lambda.LayerVersion(
      this,
      `${stackName}-SharedLayer`,
      {
        code: lambda.Code.fromAsset(path.join(__dirname, '../shared')),
        compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      }
    );

    this.libLayer = new lambda.LayerVersion(this, `${stackName}-LibLayer`, {
      code: lambda.Code.fromAsset(path.join(__dirname, '../node_dependencies')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
    });

    // auth routes
    this.confirmForgotPasswordFunction = this.createLambdaApiGatewayIntegration(
      'confirm_forgot_password',
      'POST',
      apiGatewayResource,
      environmentVariables
    );

    this.forgotPasswordFunction = this.createLambdaApiGatewayIntegration(
      'forgot_password',
      'POST',
      apiGatewayResource,
      environmentVariables
    );

    this.refreshTokenFunction = this.createLambdaApiGatewayIntegration(
      'refresh_token',
      'POST',
      apiGatewayResource,
      environmentVariables
    );

    this.resendCodeFunction = this.createLambdaApiGatewayIntegration(
      'resend_code',
      'POST',
      apiGatewayResource,
      environmentVariables
    );

    this.signInFunction = this.createLambdaApiGatewayIntegration(
      'sign_in',
      'POST',
      apiGatewayResource,
      environmentVariables
    );

    this.signUpFunction = this.createLambdaApiGatewayIntegration(
      'sign_up',
      'POST',
      apiGatewayResource,
      environmentVariables
    );

    this.verifyEmailFunction = this.createLambdaApiGatewayIntegration(
      'verify_email',
      'POST',
      apiGatewayResource,
      environmentVariables
    );

    // profile routes
    this.favoriteInstituteFunction = this.createLambdaApiGatewayIntegration(
      'favorite_institute',
      'POST',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.unfavoriteInstituteFunction = this.createLambdaApiGatewayIntegration(
      'unfavorite_institute',
      'POST',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.getMyProfileFunction = this.createLambdaApiGatewayIntegration(
      'get_my_profile',
      'GET',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.getOtherProfileFunction = this.createLambdaApiGatewayIntegration(
      'get_other_profile',
      'GET',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.createProfileFunction = this.createLambdaApiGatewayIntegration(
      'create_profile',
      'POST',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.updateProfileFunction = this.createLambdaApiGatewayIntegration(
      'update_profile',
      'PUT',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.getMyFollowingFunction = this.createLambdaApiGatewayIntegration(
      'get_my_following',
      'GET',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.getMyFollowersFunction = this.createLambdaApiGatewayIntegration(
      'get_my_followers',
      'GET',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.getMyConfirmedEventsFunction = this.createLambdaApiGatewayIntegration(
      'get_my_confirmed_events',
      'GET',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.getMyHistoricEventsFunction = this.createLambdaApiGatewayIntegration(
      'get_my_historic_events',
      'GET',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.getOtherFollowingFunction = this.createLambdaApiGatewayIntegration(
      'get_other_following',
      'GET',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.getOtherFollowersFunction = this.createLambdaApiGatewayIntegration(
      'get_other_followers',
      'GET',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.validateUsernameFunction = this.createLambdaApiGatewayIntegration(
      'validate_username',
      'GET',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.searchProfilesFunction = this.createLambdaApiGatewayIntegration(
      'search_profiles',
      'GET',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    // institute routes
    this.createInstituteFunction = this.createLambdaApiGatewayIntegration(
      'create_institute',
      'POST',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.deleteInstituteFunction = this.createLambdaApiGatewayIntegration(
      'delete_institute',
      'DELETE',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.getAllInstitutesFunction = this.createLambdaApiGatewayIntegration(
      'get_all_institutes',
      'GET',
      apiGatewayResource,
      environmentVariables
    );

    this.getAllInstitutesByPartnerTypeFunction =
      this.createLambdaApiGatewayIntegration(
        'get_all_institutes_by_partner_type',
        'GET',
        apiGatewayResource,
        environmentVariables
      );

    this.getInstituteFunction = this.createLambdaApiGatewayIntegration(
      'get_institute',
      'GET',
      apiGatewayResource,
      environmentVariables
    );

    this.updateInstituteFunction = this.createLambdaApiGatewayIntegration(
      'update_institute',
      'PUT',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    // event routes
    this.createPresenceFunction = this.createLambdaApiGatewayIntegration(
      'create_presence',
      'POST',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.createEventFunction = this.createLambdaApiGatewayIntegration(
      'create_event',
      'POST',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.deleteEventFunction = this.createLambdaApiGatewayIntegration(
      'delete_event',
      'DELETE',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.getAllEventsFunction = this.createLambdaApiGatewayIntegration(
      'get_all_events',
      'GET',
      apiGatewayResource,
      environmentVariables
    );

    this.getAllEventsByFilterFunction = this.createLambdaApiGatewayIntegration(
      'get_all_events_by_filter',
      'GET',
      apiGatewayResource,
      environmentVariables
    );

    this.getAllPresencesByEventIdFunction =
      this.createLambdaApiGatewayIntegration(
        'get_all_presences_by_event_id',
        'GET',
        apiGatewayResource,
        environmentVariables,
        authorizer
      );

    this.getEventFunction = this.createLambdaApiGatewayIntegration(
      'get_event',
      'GET',
      apiGatewayResource,
      environmentVariables
    );

    this.getTopEventsFunction = this.createLambdaApiGatewayIntegration(
      'get_top_events',
      'GET',
      apiGatewayResource,
      environmentVariables
    );

    this.deletePresenceFunction = this.createLambdaApiGatewayIntegration(
      'delete_presence',
      'DELETE',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.updateEventFunction = this.createLambdaApiGatewayIntegration(
      'update_event',
      'PUT',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    // review routes
    this.createReviewFunction = this.createLambdaApiGatewayIntegration(
      'create_review',
      'POST',
      apiGatewayResource,
      environmentVariables,
      authorizer
    );

    this.functionsThatNeedCognitoPermissions = [
      // auth routes
      this.confirmForgotPasswordFunction,
      this.forgotPasswordFunction,
      this.refreshTokenFunction,
      this.resendCodeFunction,
      this.signInFunction,
      this.signUpFunction,
      this.verifyEmailFunction,

      // profile routes
      this.createProfileFunction,
      this.updateProfileFunction,
    ];

    this.functionsThatNeedS3Permissions = [
      this.createProfileFunction,
      this.createEventFunction,
      this.createInstituteFunction,
      this.deleteEventFunction,
      this.deleteInstituteFunction,
      this.updateEventFunction,
      this.updateInstituteFunction,
      this.updateProfileFunction,
    ];

    this.functionsThatNeedSESPermissions = [this.createPresenceFunction];
  }
}
