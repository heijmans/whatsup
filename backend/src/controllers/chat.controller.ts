import "express-jwt"; // ts-node must pickup the type of req.user
import express from "express";
import Chat from "../models/chat.model";

function cleanChat({ id, name }: Chat) {
  return { id, name };
}

const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const chats = await Chat.findAll();
    res.json(chats.map(cleanChat));
  } catch (e) {
    console.warn(e);
    res.status(500).send(e.toString());
  }
});

interface IChatCreate {
  name: string;
}

router.post("/", async (req, res) => {
  const { name }: IChatCreate = req.body;
  try {
    const chat = await Chat.create({ name })
    res.json(cleanChat(chat));
  } catch (e) {
    console.warn(e);
    res.status(500).send(e.toString());
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const chat = await Chat.findById(id);
    if (chat) {
      res.json(cleanChat(chat));
    } else {
      res.status(404).send("chat not found");
    }
  } catch (e) {
    console.warn(e);
    res.status(500).send(e.toString());
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const chat = await Chat.findById(id);
    if (chat) {
      await chat.destroy();
      res.json({ success: true });
    } else {
      res.status(404).send("chat not found");
    }
  } catch (e) {
    console.warn(e);
    res.status(500).send(e.toString());
  }
});

export default router;
