import { AppAction } from "./actions";

interface ITokenAction {
  type: "TOKEN";
  token: string;
}

const wsService = {
  connect(token: string): Promise<WebSocket> {
    const ws = new WebSocket("ws://localhost:4001/ws");
    return new Promise((resolve, reject) => {
      ws.addEventListener("open", () => {
        this.sendAction(ws, { type: "TOKEN", token });
        resolve(ws);
      });
      ws.addEventListener("error", (error) => {
        reject(error);
      });
    });
  },

  sendAction(ws: WebSocket, action: AppAction | ITokenAction): void {
    ws.send(JSON.stringify(action));
  },
};

export default wsService;
