import WS from "ws";

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

export type Listener = (...args: any[]) => any;

export class MockWS {
  public closed = false;
  public messages: string[] = [];

  private listeners: { [key: string]: Listener } = {};

  public on(key: string, fn: Listener) {
    const listener = this.listeners[key];
    if (listener) {
      throw new Error("only a single listener is supported");
    }
    this.listeners[key] = fn;
  }

  public emit(key: string, ...args: any[]) {
    const fn = this.listeners[key];
    return fn.apply(null, args);
  }

  public mockSend(message: any) {
    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }
    return this.emit("message", message);
  }

  public send(message: string) {
    this.messages.push(JSON.parse(message));
  }

  public close() {
    this.closed = true;
    const res = this.emit("close");
    this.listeners = {};
    return res;
  }
}

export interface IRequest {
  params: { [key: string]: string };
  body?: any;
  user?: any;
}

export type RequestHandler = (req: IRequest, resp: MockResponse) => void;
export type WSRequestHandler = (ws: WS, req: IRequest) => void;

export class MockRouter {
  private routes: { [key: string]: RequestHandler } = {};
  private wsRoutes: { [path: string]: WSRequestHandler } = {};

  public get(path: string, fn: RequestHandler) {
    this.request("GET", path, fn);
  }

  public post(path: string, fn: RequestHandler) {
    this.request("POST", path, fn);
  }

  public delete(path: string, fn: RequestHandler) {
    this.request("DELETE", path, fn);
  }

  public ws(path: string, fn: WSRequestHandler) {
    this.wsRoutes[path] = fn;
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

  public doWS(path: string, req: IRequest = { params: {} }) {
    const ws = new MockWS();
    const fn = this.wsRoutes[path];
    if (!fn) {
      throw new Error(`ws route not found: ${path}`);
    }
    fn((ws as any) as WS, req);
    return ws;
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
