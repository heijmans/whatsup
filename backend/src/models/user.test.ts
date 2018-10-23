import User from "./user.model";

describe("user", () => {
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  it("should create a user with an encrypted password", async () => {
    const user = await User.create({ username: "jan", password: "*" });
    expect(user.username).toBe("jan");
    expect(user.password).toMatch(/^\$2b\$/);
  });

  it("should validate a plain password", async () => {
    const user = await User.create({ username: "kees", password: "veilig" });
    expect(user.password).toMatch(/^\$2b\$/);
    expect(user.validatePassword("veilig")).toBe(true);
    expect(user.validatePassword("other")).toBe(false);
  });
});
