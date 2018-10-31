import { MockModel, toSpy } from "../lib/test-helpers";
import User from "./user.model";
import userService from "./user.service";

jest.mock("./user.model", () => new MockModel("login"));

const MOCK_CREDS = {
  password: "rwt4",
  username: "user1",
};

const MOCK_USER = {
  id: 15,
  username: "testuser1",
};

describe("user service", () => {
  it("should get the user", async () => {
    toSpy(User.findById).mockResolvedValue(MOCK_USER);
    const user = await userService.getUser({ userId: 10 });
    expect(toSpy(User.findById)).toHaveBeenCalledWith(10);
    expect(user).toEqual(MOCK_USER);
  });

  it("should register a user", async () => {
    toSpy(User.create).mockResolvedValue(MOCK_USER);
    const user = await userService.registerUser(MOCK_CREDS);
    expect(toSpy(User.create)).toHaveBeenCalledWith(MOCK_CREDS);
    expect(user).toEqual(MOCK_USER);
  });

  it("should login a user", async () => {
    toSpy(User.login).mockResolvedValue(MOCK_USER);
    const result = await userService.login(MOCK_CREDS);
    expect(toSpy(User.login)).toHaveBeenCalledWith(MOCK_CREDS.username, MOCK_CREDS.password);
    expect(result).toEqual({ success: true, token: expect.any(String) }); // TODO: check token
  });
});
