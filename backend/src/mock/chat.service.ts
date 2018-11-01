import { IChat, IChatCreateData, IChats } from "../api/api-types";
import { Chat, chats, create } from "./db";

function toIChat({ $loki: id, name }: Chat): IChat {
  return { id, name };
}

function getChat(id: number): Chat {
  const chat = chats.get(id);
  if (!chat) {
    throw new Error("not found");
  }
  return chat;
}

const chatService = {
  async listChats(): Promise<IChats> {
    return chats.chain().simplesort("name").data().map(toIChat);
  },

  async createChat(data: IChatCreateData): Promise<IChat> {
    return toIChat(create(chats, data));
  },

  async getChat(id: number): Promise<IChat> {
    return toIChat(getChat(id));
  },

  async deleteChat(id: number): Promise<void> {
    chats.remove(getChat(id));
  },
};

export default chatService;
