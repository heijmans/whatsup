import Chat from "./chat.model";

describe("chat", () => {
  beforeAll(async () => {
    await Chat.sync({ force: true });
  });

  it("should create a chat", async () => {
    const chat = await Chat.create({ name: "subj" });
    expect(chat.id).toBeGreaterThan(0);
    expect(chat.name).toBe("subj");
  });
});
