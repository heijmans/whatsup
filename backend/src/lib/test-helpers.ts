import ws from "ws";

// tslint:disable: max-classes-per-file

export function toSpy(x: any): jest.SpyInstance {
  return x as jest.SpyInstance;
}

export class MockModel {
  public create = jest.fn();
  public findAll = jest.fn();
  public findById = jest.fn();

  constructor(...extraFields: string[]) {
    extraFields.forEach((field) => {
      (this as any)[field] = jest.fn();
    });
  }
}

export class MockResponse {
  public json = jest.fn();
  public send = jest.fn();
  public status = jest.fn();
}

export interface IRequest {
  params: { [key: string]: string };
  body?: any;
  user?: any;
}

export type RequestHandler = (req: IRequest, resp: MockResponse) => void;

export class MockRouter {
  private routes: { [key: string]: RequestHandler } = {};

  public get(path: string, fn: RequestHandler) {
    this.request("GET", path, fn);
  }

  public post(path: string, fn: RequestHandler) {
    this.request("POST", path, fn);
  }

  public delete(path: string, fn: RequestHandler) {
    this.request("DELETE", path, fn);
  }

  public ws(_: string, __: (ws: ws, req: IRequest) => void) {
    throw new Error("unimplemented");
  }

  public doGet(path: string, req: IRequest): MockResponse {
    return this.doRequest("GET", path, req);
  }

  public doPost(path: string, req: IRequest): MockResponse {
    return this.doRequest("POST", path, req);
  }

  public doDelete(path: string, req: IRequest): MockResponse {
    return this.doRequest("DELETE", path, req);
  }

  private request(method: string, path: string, fn: RequestHandler) {
    this.routes[`${method} ${path}`] = fn;
  }

  private doRequest(method: string, path: string, req: IRequest): MockResponse {
    const response = new MockResponse();
    const key = `${method} ${path}`;
    const fn = this.routes[key];
    if (!fn) {
      throw new Error(`route not found: ${key}`);
    }
    fn(req, response);
    return response;
  }
}

export function toMockRouter(x: any): MockRouter {
  return x as MockRouter;
}
