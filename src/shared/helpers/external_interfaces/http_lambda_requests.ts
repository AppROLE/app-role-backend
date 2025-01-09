/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpResponse, HttpRequest } from './http_models';

class LambdaHttpResponse extends HttpResponse {
  constructor(
    body: any,
    status_code: number | undefined,
    headers: Record<string, any> | undefined,
    kwargs: Record<string, any> = {}
  ) {
    const _body = body || {};
    const _status_code = status_code || 200;
    const _headers = headers || {};

    _headers['Access-Control-Allow-Origin'] = '*';

    if (kwargs.add_default_cors_headers !== false) {
      _headers['Access-Control-Allow-Origin'] = '*';
    }

    super(_status_code, _body, _headers);
  }

  toJSON(): Record<string, any> {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(this.body),
      headers: this.headers,
      isBase64Encoded: false,
    };
  }

  toString(): string {
    return `LambdaHttpResponse (status_code=${
      this.statusCode
    }, body=${JSON.stringify(this.body)}, headers=${JSON.stringify(
      this.headers
    )})`;
  }
}

class LambdaDefaultHTTP {
  method: string = '';
  path: string = '';
  protocol: string = '';
  source_ip: string = '';
  user_agent: string = '';

  constructor(data: Record<string, any> = {}) {
    this.method = data.method || '';
    this.path = data.path || '';
    this.protocol = data.protocol || '';
    this.source_ip = data.sourceIp || '';
    this.user_agent = data.userAgent || '';
  }

  equals(other: LambdaDefaultHTTP): boolean {
    return (
      this.method === other.method &&
      this.path === other.path &&
      this.protocol === other.protocol &&
      this.source_ip === other.source_ip &&
      this.user_agent === other.user_agent
    );
  }
}

export type LambdaEvent<
  Tbody extends Record<string, any> = Record<string, any>,
  THeaders extends Record<string, any> = Record<string, any>
> = {
  version: string;
  rawPath: string;
  rawQueryString: string;
  headers?: THeaders;
  queryStringParameters?: string;
  requestContext: Record<string, any>;
  body?: Tbody;
};

class LambdaHttpRequest<
  TBody extends Record<string, any> = Record<string, any>,
  THeaders extends Record<string, any> = Record<string, any>,
  TQueryParams extends Record<string, any> = Record<string, any>
> extends HttpRequest<TBody, THeaders, TQueryParams> {
  version: string;
  rawPath: string;
  rawQueryString: string;
  queryStringParameters: TQueryParams;
  requestContext: Record<string, any>;
  http: LambdaDefaultHTTP;
  requesterUser: Record<string, any>;

  constructor(data: LambdaEvent<TBody, THeaders>) {
    const headers = data.headers || ({} as THeaders);
    const queryStringParameters = JSON.parse(data.queryStringParameters || '');
    // Processa o corpo da requisição
    let body: TBody;
    try {
      body = data.body
        ? typeof data.body === 'string'
          ? JSON.parse(data.body)
          : data.body
        : ({} as TBody);
    } catch {
      body = data.body as TBody;
    }

    // Chama o construtor da classe base
    super(body, headers, queryStringParameters);

    // Inicializa as propriedades específicas de LambdaHttpRequest
    this.version = data.version;
    this.rawPath = data.rawPath;
    this.rawQueryString = data.rawQueryString;
    this.queryStringParameters = queryStringParameters;
    this.requestContext = data.requestContext;
    this.http = new LambdaDefaultHTTP(this.requestContext.external_interfaces);
    this.requesterUser = data.requestContext.authorizer?.claims || {};
  }

  toString(): string {
    return `LambdaHttpRequest (version=${this.version}, rawPath=${
      this.rawPath
    }, rawQueryString=${this.rawQueryString}, headers=${JSON.stringify(
      this.data.headers
    )}, queryStringParameters=${JSON.stringify(
      this.queryStringParameters
    )}, body=${JSON.stringify(this.data.body)}, requesterUser=${JSON.stringify(
      this.requesterUser
    )})`;
  }
}

class HttpResponseRedirect extends HttpResponse {
  constructor(location: string) {
    super(302, { Location: location });
  }
}

export { LambdaHttpResponse, LambdaHttpRequest, HttpResponseRedirect };
