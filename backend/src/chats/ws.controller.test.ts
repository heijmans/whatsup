import jwt from "jsonwebtoken";
import secrets from "../../config/secrets";
import { MockModel, MockRouter, MockWS, toMockRouter, toSpy } from "../lib/test-helpers";
import User from "../users/user.model";
import userService from "../users/user.service";
import wsController from "./ws.controller";

jest.mock("express", () => ({
  Router: () => new MockRouter(),
}));
jest.mock("../users/user.model", () => new MockModel());

const mockController = toMockRouter(wsController(userService, secrets.jwt));

async function openWS(username: string): Promise<MockWS> {
  toSpy(User.findByPk).mockResolvedValue({ id: 15, username });
  const ws = mockController.doWS("/");
  const token = jwt.sign({ userId: 15 }, secrets.jwt);
  await ws.receive({ type: "TOKEN", token });
  expect(User.findByPk).toHaveBeenCalledWith(15);
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
    await ws.receive({ content: "hello" });
    expect(ws.closed).toBe(true);
  });

  it("should send messages to other clients", async () => {
    const ws1 = await openWS("jan");
    const ws2 = await openWS("kees");
    const ws3 = await openWS("piet");

    await ws1.receive({ type: "MESSAGE", chatId: 7, content: "m1" });
    await ws1.receive({ type: "MESSAGE", chatId: 7, content: "m2" });
    await ws2.receive({ type: "MESSAGE", chatId: 8, content: "m3" });
    await ws2.receive({ type: "OTHER" });

    expect(ws1.messages).toEqual([
      { type: "MESSAGE", from: "kees", chatId: 8, content: "m3" },
      { type: "OTHER" },
    ]);

    expect(ws2.messages).toEqual([
      { type: "MESSAGE", from: "jan", chatId: 7, content: "m1" },
      { type: "MESSAGE", from: "jan", chatId: 7, content: "m2" },
    ]);

    expect(ws3.messages).toEqual([
      { type: "MESSAGE", from: "jan", chatId: 7, content: "m1" },
      { type: "MESSAGE", from: "jan", chatId: 7, content: "m2" },
      { type: "MESSAGE", from: "kees", chatId: 8, content: "m3" },
      { type: "OTHER" },
    ]);

    ws1.close();
    ws2.close();
    ws3.close();
  });
});
