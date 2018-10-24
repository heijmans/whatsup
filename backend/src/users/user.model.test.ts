import User from "./user.model";

describe("user", () => {
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  it("should create a user with an encrypted password", async () => {
    const user = await User.create({ username: "jan", password: "*" });
    expect(user.id).toBeGreaterThan(0);
    expect(user.username).toBe("jan");
    expect(user.password).toMatch(/^\$2b\$/);
  });

  it("should validate a plain password", async () => {
    const user = await User.create({ username: "kees", password: "veilig" });
    expect(user.password).toMatch(/^\$2b\$/);
    expect(user.validatePassword("veilig")).toBe(true);
    expect(user.validatePassword("other")).toBe(false);
  });

  it("should login a user", async () => {
    await User.create({ username: "piet", password: "fvja54" });

    const user = await User.login("piet", "fvja54");
    expect(user).toBeTruthy();
    expect(user!.username).toBe("piet");

    expect(await User.login("piet", "xfvja54")).toBeFalsy();
    expect(await User.login("pietx", "fvja54")).toBeFalsy();
  });
});
