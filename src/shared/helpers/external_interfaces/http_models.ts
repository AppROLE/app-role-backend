/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatusCodeEnum } from '../enum/http_status_code_enum';
import { IRequest, IResponse } from '../external_interfaces/external_interface';

class HttpRequest<
  TBody extends Record<string, any> = Record<string, any>,
  THeaders extends Record<string, any> = Record<string, any>,
  TQueryParams extends Record<string, any> = Record<string, any>
> implements IRequest<TBody, THeaders, TQueryParams>
{
  private _body: TBody;
  private _headers: THeaders;
  private _queryParams: TQueryParams;

  constructor(
    body: TBody = {} as TBody,
    headers: THeaders = {} as THeaders,
    queryParams: TQueryParams = {} as TQueryParams
  ) {
    this._body = body;
    this._headers = headers;
    this._queryParams = queryParams;

    this.validateOverlappingKeys();
  }

  private validateOverlappingKeys(): void {
    const overlappingKeys = new Set<string>();

    const addOverlaps = (
      source: Record<string, any>,
      target: Record<string, any>
    ) => {
      Object.keys(source).forEach((key) => {
        if (key in target) overlappingKeys.add(key);
      });
    };

    addOverlaps(this._body, this._headers);
    addOverlaps(this._body, this._queryParams);
    addOverlaps(this._headers, this._queryParams);

    if (overlappingKeys.size > 0) {
      console.warn(
        `Overlapping keys detected: ${Array.from(overlappingKeys).join(', ')}`
      );
    }
  }

  get data(): { body: TBody; headers: THeaders; query_params: TQueryParams } {
    return {
      body: this._body,
      headers: this._headers,
      query_params: this._queryParams,
    };
  }

  toString(): string {
    return `HttpRequest (body=${JSON.stringify(
      this._body
    )}, headers=${JSON.stringify(this._headers)}, query_params=${JSON.stringify(
      this._queryParams
    )})`;
  }
}

class HttpResponse implements IResponse {
  _status_code: number;
  body: Record<string, any>;
  headers: Record<string, any>;

  private _data: Record<string, any> = {};

  constructor(
    status_code?: number | undefined,
    body: Record<string, any> = {},
    headers: Record<string, any> = {}
  ) {
    this._status_code = status_code || HttpStatusCodeEnum.OK;
    this.body = body || {};
    this.headers = headers;

    const data_json: Record<string, any> = {};
    if (typeof body === 'object') {
      Object.assign(data_json, body);
    }
    if (typeof body === 'string') {
      Object.assign(data_json, { body });
    }

    Object.assign(data_json, headers);
    this.data = data_json;
  }
  get statusCode(): number {
    return this._status_code || HttpStatusCodeEnum.OK;
  }

  set statusCode(value: number) {
    this._status_code = value;
  }

  get data(): Record<string, any> {
    return this._data;
  }

  set data(value: Record<string, any>) {
    this._data = value;
  }

  toString(): string {
    return `HttpResponse (status_code=${
      this._status_code
    }, body=${JSON.stringify(this.body)}, headers=${JSON.stringify(
      this.headers
    )})`;
  }
}

export { HttpRequest, HttpResponse };

// Teste
const body = { body: 'body' };
const headers = { headers: 'headers', body: 'body' };
const query_params = { query_params: 'query_params' };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const data = { data: 'data' };
const request = new HttpRequest(body, headers, query_params);
const response = new HttpResponse(200, body, headers);
