import { IChat } from "./state";

function jwtHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function jsonBody() {
  return {
    "Content-Type": "application/json",
  };
}

function checkResponse(response: Response) {
  if (response.status >= 300) {
    throw new Error(`error: ${response.status}`);
  }
}

function sendAction(ws: WebSocket, action: any): void {
  ws.send(JSON.stringify(action));
}

export interface IMessageAction {
  type: "MESSAGE";
  uuid: string;
  from?: string;
  chatId: number;
  content: string;
}

const chatService = {
  async all(token: string): Promise<IChat[]> {
    const response = await fetch("/api/chats", { headers: jwtHeaders(token) });
    checkResponse(response);
    const chats = await response.json();
    return chats;
  },

  async create(token: string, name: string): Promise<IChat> {
    const response = await fetch("/api/chats", {
      body: JSON.stringify({ name }),
      headers: { ...jsonBody(), ...jwtHeaders(token) },
      method: "POST",
    });
    checkResponse(response);
    const chat = await response.json();
    return chat;
  },

  async get(token: string, id: number): Promise<string> {
    const response = await fetch(`/api/chats/${id}`, { headers: jwtHeaders(token) });
    checkResponse(response);
    const chat = await response.json();
    return chat;
  },

  async delete(token: string, id: number): Promise<void> {
    const response = await fetch(`/api/chats/${id}`, {
      headers: jwtHeaders(token),
      method: "DELETE",
    });
    checkResponse(response);
    await response.json();
  },

  connect(token: string): WebSocket {
    const ws = new WebSocket("ws://localhost:4000/ws");
    sendAction(ws, { type: "TOKEN", token });
    return ws;
  },

  sendMessage(ws: WebSocket, message: IMessageAction) {
    sendAction(ws, message);
  },
};

export default chatService;
