import jwt from "jsonwebtoken";
import secrets from "../../config/secrets";
import { MockModel, MockRouter, MockWS, toMockRouter, toSpy } from "../lib/test-helpers";
import User from "../users/user.model";
import wsController from "./ws.controller";

jest.mock("express", () => ({
  Router: () => new MockRouter(),
}));
jest.mock("../users/user.model", () => new MockModel());

const mockController = toMockRouter(wsController);

async function openWS(username: string): Promise<MockWS> {
  toSpy(User.findById).mockResolvedValue({ id: 15, username });
  const ws = mockController.doWS("/");
  const token = jwt.sign({ userId: 15 }, secrets.jwt);
  await ws.mockSend({ type: "TOKEN", token });
  expect(User.findById).toHaveBeenCalledWith(15);
  return ws;
}

describe("ws controller", () => {
  it("should open the connection when a correct token is received", async () => {
    const ws = await openWS("jan");
    expect(ws.closed).toBe(false);
    ws.close();
  });

  it("should close the connection when an unauthorized message is received", async () => {
    const ws = mockController.doWS("/");
    await ws.mockSend({ content: "hello" });
    expect(ws.closed).toBe(true);
  });

  it("should send messages to other clients", async () => {
    const ws1 = await openWS("jan");
    const ws2 = await openWS("kees");
    const ws3 = await openWS("piet");

    await ws1.mockSend({ type: "MESSAGE", chatId: 7, content: "m1" });
    await ws1.mockSend({ type: "MESSAGE", chatId: 7, content: "m2" });
    await ws2.mockSend({ type: "MESSAGE", chatId: 8, content: "m3" });

    expect(ws1.messages).toEqual([
      { type: "MESSAGE", from: "kees", chatId: 8, content: "m3" },
    ]);

    expect(ws2.messages).toEqual([
      { type: "MESSAGE", from: "jan", chatId: 7, content: "m1" },
      { type: "MESSAGE", from: "jan", chatId: 7, content: "m2" },
    ]);

    expect(ws3.messages).toEqual([
      { type: "MESSAGE", from: "jan", chatId: 7, content: "m1" },
      { type: "MESSAGE", from: "jan", chatId: 7, content: "m2" },
      { type: "MESSAGE", from: "kees", chatId: 8, content: "m3" },
    ]);

    ws1.close();
    ws2.close();
    ws3.close();
  });
});
