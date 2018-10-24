import { MockModel, MockRouter, toSpy } from "../lib/test-helpers";
import User from "../models/user.model";
import userController from "./user.controller";

jest.mock("express", () => ({
  Router: () => new MockRouter(),
}));
jest.mock("../models/user.model", () => new MockModel('login'));

const MOCK_CREDS = {
  username: "user1",
  password: "rwt4",
};

const MOCK_USER = {
  id: 15,
  username: "testuser1",
};

describe("user controller", () => {
  it("should get the user", async () => {
    toSpy(User.findById).mockResolvedValue(MOCK_USER);
    const response = userController.doGet("/", { params: {}, user: { userId: 10 } });
    expect(toSpy(User.findById)).toHaveBeenCalledWith(10);

    await Promise.resolve();
    expect(response.json).toHaveBeenCalledWith(MOCK_USER);
  });

  it("should register a user", async () => {
    toSpy(User.create).mockResolvedValue(MOCK_USER);
    const response = userController.doPost("/register", { params: {}, body: MOCK_CREDS });
    expect(toSpy(User.create)).toHaveBeenCalledWith(MOCK_CREDS);

    await Promise.resolve();
    expect(response.json).toHaveBeenCalledWith(MOCK_USER);
  });

  it("should login a user", async () => {
    toSpy(User.login).mockResolvedValue(MOCK_USER);
    const response = userController.doPost("/login", { params: {}, body: MOCK_CREDS });
    expect(toSpy(User.login)).toHaveBeenCalledWith(MOCK_CREDS.username, MOCK_CREDS.password);

    await Promise.resolve();
    expect(response.json).toHaveBeenCalledWith({ success: true, token: expect.any(String) });
  });
});
