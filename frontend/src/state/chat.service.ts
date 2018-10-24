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

const chatService = {
  async all(token: string): Promise<IChat[]> {
    const response = await fetch("/api/chats", { headers: jwtHeaders(token) });
    const chats = await response.json();
    return chats;
  },

  async create(token: string, name: string): Promise<IChat> {
    const response = await fetch("/api/chats", {
      body: JSON.stringify({ name }),
      headers: { ...jsonBody(), ...jwtHeaders(token) },
      method: "POST",
    });
    const chat = await response.json();
    return chat;
  },

  async get(token: string, id: number): Promise<string> {
    const response = await fetch(`/api/chats/${id}`, { headers: jwtHeaders(token) });
    const chat = await response.json();
    return chat;
  },

  async delete(token: string, id: number): Promise<void> {
    const response = await fetch(`/api/chats/${id}`, {
      headers: jwtHeaders(token),
      method: "DELETE",
    });
    await response.json();
  },
};

export default chatService;
