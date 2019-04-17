import { MockModel, toSpy } from "../lib/test-helpers";
import Chat from "./chat.model";
import chatService from "./chat.service";

jest.mock("./chat.model", () => new MockModel());

const MOCK_CHAT1 = {
  id: 1,
  name: "test",
};
const MOCK_CHAT2 = {
  id: 2,
  name: "other",
};
const MOCK_CHATS = [MOCK_CHAT1, MOCK_CHAT2];

describe("chat service", () => {
  it("should get all chats", async () => {
    toSpy(Chat.findAll).mockResolvedValue(MOCK_CHATS);
    const chats = await chatService.listChats();
    expect(toSpy(Chat.findAll)).toHaveBeenCalledWith({ order: [["name"]] });
    expect(chats).toEqual(MOCK_CHATS);
  });

  it("should create a chat", async () => {
    toSpy(Chat.create).mockResolvedValue(MOCK_CHAT2);
    const chat = await chatService.createChat({ name: "ok" });
    expect(toSpy(Chat.create)).toHaveBeenCalledWith({ name: "ok" });
    expect(chat).toEqual(MOCK_CHAT2);
  });

  it("should get a chat", async () => {
    toSpy(Chat.findByPk).mockResolvedValue(MOCK_CHAT1);
    const chat = await chatService.getChat(5);
    expect(toSpy(Chat.findByPk)).toHaveBeenCalledWith(5);
    expect(chat).toEqual(MOCK_CHAT1);
  });

  it("should delete a chat", async () => {
    const mockChat = { destroy: jest.fn().mockResolvedValue(undefined) };
    toSpy(Chat.findByPk).mockResolvedValue(mockChat);
    await chatService.deleteChat(5);
    expect(toSpy(Chat.findByPk)).toHaveBeenCalledWith(5);
    expect(mockChat.destroy).toHaveBeenCalledWith();
  });
});
