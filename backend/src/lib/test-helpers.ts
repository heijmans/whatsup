import ws from "ws";

export function toSpy(x: any): jest.SpyInstance {
  return x as jest.SpyInstance;
}

export class MockModel {
  create = jest.fn();
  findAll = jest.fn();
  findById = jest.fn();

  constructor(...extraFields: string[]) {
    extraFields.forEach((field) => {
      (this as any)[field] = jest.fn();
    });
  }
}

export class MockResponse {
  json = jest.fn();
  send = jest.fn();
  status = jest.fn();
}

export interface IRequest {
  params: { [key: string]: string };
  body?: any;
  user?: any;
}

export type RequestHandler = (req: IRequest, resp: MockResponse) => void;

export class MockRouter {
  routes: { [key: string]: RequestHandler } = {};

  request(method: string, path: string, fn: RequestHandler) {
    this.routes[`${method} ${path}`] = fn;
  }

  get(path: string, fn: RequestHandler) {
    this.request("GET", path, fn);
  }

  post(path: string, fn: RequestHandler) {
    this.request("POST", path, fn);
  }

  delete(path: string, fn: RequestHandler) {
    this.request("DELETE", path, fn);
  }

  ws(_: string, __: (ws: ws, req: IRequest) => void) {
    throw new Error("unimplemented");
  }

  doRequest(method: string, path: string, req: IRequest): MockResponse {
    const response = new MockResponse();
    const key = `${method} ${path}`;
    const fn = this.routes[key];
    if (!fn) {
      throw new Error(`route not found: ${key}`);
    }
    fn(req, response);
    return response;
  }

  doGet(path: string, req: IRequest): MockResponse {
    return this.doRequest("GET", path, req);
  }

  doPost(path: string, req: IRequest): MockResponse {
    return this.doRequest("POST", path, req);
  }

  doDelete(path: string, req: IRequest): MockResponse {
    return this.doRequest("DELETE", path, req);
  }
}

declare module "express" {
  function Router(options?: RouterOptions): MockRouter;
}
