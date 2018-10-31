// auto generated, do not edit

// tslint:disable: array-type

import { checkResponse, jsonBody, jwtHeaders } from "../lib/api-service-helpers";
import { IChat, IChatCreateData, IChats } from "./api-types";

const chatService = {
  async listChats(token: string): Promise<IChats> {
    const response = await fetch(`/api/chats`, {
      headers: { ...jwtHeaders(token) },
      method: "GET",
    });
    checkResponse(response);
    return await response.json();
  },

  async createChat(token: string, chatCreateData: IChatCreateData): Promise<IChat> {
    const response = await fetch(`/api/chats`, {
      body: JSON.stringify(chatCreateData),
      headers: { ...jsonBody(), ...jwtHeaders(token) },
      method: "POST",
    });
    checkResponse(response);
    return await response.json();
  },

  async getChat(token: string, id: number): Promise<IChat> {
    const response = await fetch(`/api/chats/${id}`, {
      headers: { ...jwtHeaders(token) },
      method: "GET",
    });
    checkResponse(response);
    return await response.json();
  },

  async deleteChat(token: string, id: number): Promise<void> {
    const response = await fetch(`/api/chats/${id}`, {
      headers: { ...jwtHeaders(token) },
      method: "DELETE",
    });
    checkResponse(response);
    await response.json();
  },

};

export default chatService;
