import {
  LambdaEvent,
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';
import {
  GetAllInstitutesByPartnerTypeController,
  GetAllInstitutesByPartnerTypeRequestBody,
} from './get_all_institutes_by_partner_type_controller';
import { GetAllInstitutesByPartnerTypeUseCase } from './get_all_institutes_by_partner_type_usecase';

const usecase = new GetAllInstitutesByPartnerTypeUseCase();
const controller = new GetAllInstitutesByPartnerTypeController(usecase);

export async function lambda_handler(
  event: LambdaEvent<GetAllInstitutesByPartnerTypeRequestBody>,
  context: any
) {
  const httpRequest = new LambdaHttpRequest(event);
  const requesterUser = event.requestContext.authorizer.claims;
  await usecase.connect();
  const response = await controller.handle(httpRequest, requesterUser);
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers
  );

  return httpResponse.toJSON();
}
