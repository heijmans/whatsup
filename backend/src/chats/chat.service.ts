import { IChat, IChatCreateData, IChats } from "../api/api-types";
import Chat from "./chat.model";

function toIChat({ id, name }: Chat): IChat {
  return { id, name };
}

const chatService = {
  async listChats(): Promise<IChats> {
    return await Chat.findAll({ order: [["name"]] }).map(toIChat);
  },

  async createChat(chatCreateData: IChatCreateData): Promise<IChat> {
    return toIChat(await Chat.create(chatCreateData));
  },

  async getChat(id: number): Promise<IChat> {
    const chat = await Chat.findById(id);
    if (!chat) {
      throw new Error("not found");
    }
    return toIChat(chat);
  },

  async deleteChat(id: number): Promise<void> {
    const chat = await Chat.findById(id);
    if (!chat) {
      throw new Error("not found");
    }
    await chat.destroy();
  },
};

export default chatService;
