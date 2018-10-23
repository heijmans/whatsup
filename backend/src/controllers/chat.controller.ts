import "express-jwt"; // ts-node must pickup the type of req.user
import express from "express";
import Chat from "../models/chat.model";

function cleanChat({ id, name }: Chat) {
  return { id, name };
}

const router = express.Router();

router.get("/", (_, res) => {
  Chat.findAll()
    .then((chats) => {
      res.send(chats.map(cleanChat));
    })
    .catch((e) => {
      res.status(500).send(e.toString());
    });
});

interface IChatCreate {
  name: string;
}

router.post("/", (req, res) => {
  const { name }: IChatCreate = req.body;
  Chat.create({ name })
    .then((chat) => {
      res.json(cleanChat(chat));
    })
    .catch((e) => {
      res.status(500).send(e.toString());
    });
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  Chat.findById(id)
    .then((chat) => {
      if (chat) {
        res.send(chat);
      } else {
        res.status(404).send("chat not found");
      }
    })
    .catch((e) => {
      res.status(500).send(e.toString());
    });
});

router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  Chat.findById(id)
    .then((chat) => {
      if (chat) {
        return chat.destroy().then(() => {
          res.send({ success: true });
        });
      } else {
        res.status(404).send("chat not found");
        return;
      }
    })
    .catch((e) => {
      res.status(500).send(e.toString());
    });
});

export default router;
