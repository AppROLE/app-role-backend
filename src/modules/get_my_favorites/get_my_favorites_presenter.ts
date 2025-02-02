import { IInstituteRepository } from 'src/shared/domain/repositories/institute_repository_interface';
import { IProfileRepository } from 'src/shared/domain/repositories/profile_repository_interface';
import { EntityCardReturn } from 'src/shared/helpers/types/entity_card_return';
import { Repository } from 'src/shared/infra/database/repositories/repository';
import { IRequest } from 'src/shared/helpers/external_interfaces/external_interface';
import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
  OK,
  Unauthorized,
} from 'src/shared/helpers/external_interfaces/http_codes';
import { UserAPIGatewayDTO } from 'src/shared/infra/database/dtos/user_api_gateway_dto';
import {
  ConflictItems,
  EntityError,
  ForbiddenAction,
  MissingParameters,
  NoItemsFound,
} from 'src/shared/helpers/errors/errors';
import { WrongTypeParameters } from 'src/shared/helpers/errors/errors';
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from 'src/shared/helpers/external_interfaces/http_lambda_requests';

export class GetMyFavoritesUsecase {
  repository: Repository;
  private profile_repo?: IProfileRepository;
  private institute_repo?: IInstituteRepository;

  constructor() {
    this.repository = new Repository({
      profile_repo: true,
      institute_repo: true,
    });
  }

  async connect() {
    await this.repository.connectRepository();
    this.profile_repo = this.repository.profile_repo;
    this.institute_repo = this.repository.institute_repo;

    if (!this.profile_repo)
      throw new Error('Expected to have an instance of the profile repository');

    if (!this.institute_repo)
      throw new Error(
        'Expected to have an instance of the institute repository'
      );
  }

  async execute(userId: string): Promise<EntityCardReturn[]> {
    const profile = await this.profile_repo!.getByUserId(userId);
    if (!profile) throw new NoItemsFound('Perfil do usuário não encontrado');

    const favorite_ids = profile.favorites;

    if (favorite_ids.length === 0) return [];

    const institutes = await this.institute_repo!.getInstitutesByIds(
      favorite_ids
    );

    return institutes.map((institute) => ({
      instituteId: institute.instituteId,
      name: institute.name,
      logo: institute.logo,
    }));
  }
}

export class GetMyFavoritesController {
  constructor(private readonly usecase: GetMyFavoritesUsecase) {}

  async handle(request: IRequest, requesterUser: Record<string, any>) {
    try {
      const userApiGateway = UserAPIGatewayDTO.fromAPIGateway(requesterUser);

      if (!userApiGateway) throw new ForbiddenAction('Usuário');

      const institutes = await this.usecase.execute(userApiGateway.userId);

      return new OK({ institutes: institutes });
    } catch (error: any) {
      if (
        error instanceof EntityError ||
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message);
      }
      if (error instanceof ConflictItems) {
        return new Conflict(error.message);
      }
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message);
      }

      if (error instanceof NoItemsFound) {
        return new NotFound(error.message);
      }

      if (error instanceof Error) {
        return new InternalServerError(error.message);
      }
    } finally {
      await this.usecase.repository.closeSession();
    }
  }
}

const usecase = new GetMyFavoritesUsecase();
const controller = new GetMyFavoritesController(usecase);

export async function lambda_handler(event: any, context: any) {
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
