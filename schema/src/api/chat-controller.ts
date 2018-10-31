// auto generated, do not edit

// tslint:disable: array-type

import express, { Router } from "express";
import { Chat, ChatCreate, Chats } from "./api-types";

export interface IChatService {
  listChats: () => Promise<Chats>;
  createChat: (body: ChatCreate) => Promise<Chat>;
  getChat: (id: number) => Promise<Chat>;
  deleteChat: (id: number) => Promise<void>;
}

export function createChatController(service: IChatService): Router {
  const router = express.Router();

  router.get("/chats", async (req, res) => {
    try {
      const result = await service.listChats();
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  router.post("/chats", async (req, res) => {
    try {
      const body = req.body as ChatCreate;
      const result = await service.createChat(body);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  router.get("/chats/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const result = await service.getChat(id);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  router.delete("/chats/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      await service.deleteChat(id);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  return router;
}
