abstract class IRequest<
  TBody = Record<string, any>,
  THeaders = Record<string, any>,
  TQueryParams = Record<string, any>
> {
  abstract get data(): {
    body: TBody;
    headers: THeaders;
    query_params: TQueryParams;
  };
}

abstract class IResponse {
  abstract get statusCode(): number;
  abstract get data(): Record<string, unknown>;
}

export { IRequest, IResponse };
