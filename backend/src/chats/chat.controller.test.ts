import { MockModel, MockRouter, toMockRouter, toSpy } from "../lib/test-helpers";
import chatController from "./chat.controller";
import Chat from "./chat.model";

jest.mock("express", () => ({
  Router: () => new MockRouter(),
}));
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

const mockController = toMockRouter(chatController);

describe("chat controller", () => {
  it("should get all chats", async () => {
    toSpy(Chat.findAll).mockResolvedValue(MOCK_CHATS);
    const response = mockController.doGet("/", { params: {} });
    expect(toSpy(Chat.findAll)).toHaveBeenCalledWith();

    await Promise.resolve();
    expect(response.json).toHaveBeenCalledWith(MOCK_CHATS);
  });

  it("should create a chat", async () => {
    toSpy(Chat.create).mockResolvedValue(MOCK_CHAT2);
    const response = mockController.doPost("/", { params: {}, body: { name: "ok" } });
    expect(toSpy(Chat.create)).toHaveBeenCalledWith({ name: "ok" });

    await Promise.resolve();
    expect(response.json).toHaveBeenCalledWith(MOCK_CHAT2);
  });

  it("should get a chat", async () => {
    toSpy(Chat.findById).mockResolvedValue(MOCK_CHAT1);
    const response = mockController.doGet("/:id", { params: { id: "5" } });
    expect(toSpy(Chat.findById)).toHaveBeenCalledWith(5);

    await Promise.resolve();
    expect(response.json).toHaveBeenCalledWith(MOCK_CHAT1);
  });

  it("should delete a chat", async () => {
    const mockChat = { destroy: jest.fn().mockResolvedValue(undefined) };

    toSpy(Chat.findById).mockResolvedValue(mockChat);
    const response = mockController.doDelete("/:id", { params: { id: "5" } });
    expect(toSpy(Chat.findById)).toHaveBeenCalledWith(5);

    await Promise.resolve();
    expect(mockChat.destroy).toHaveBeenCalledWith();

    await Promise.resolve();
    expect(response.json).toHaveBeenCalledWith({ success: true });
  });
});
