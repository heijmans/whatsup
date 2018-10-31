import { IChat, IChatCreateData, IChats } from "../api/api-types";
import Chat from "./chat.model";

function toIChat({ id, name }: Chat): IChat {
  return { id, name };
}

async function getChat(id: number): Promise<Chat> {
  const chat = await Chat.findById(id);
  if (!chat) {
    throw new Error("not found");
  }
  return chat;
}

const chatService = {
  async listChats(): Promise<IChats> {
    const chats = await Chat.findAll({ order: [["name"]] });
    return chats.map(toIChat);
  },

  async createChat(data: IChatCreateData): Promise<IChat> {
    return toIChat(await Chat.create(data));
  },

  async getChat(id: number): Promise<IChat> {
    return toIChat(await getChat(id));
  },

  async deleteChat(id: number): Promise<void> {
    const chat = await getChat(id);
    await chat.destroy();
  },
};

export default chatService;
