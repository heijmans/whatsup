// auto generated, do not edit

// tslint:disable: array-type

import express, { Router } from "express";
import { getAuthorization } from "../lib/api-controller-helpers";
import { AuthorizationData, Chat, ChatCreateData, Chats } from "./api-types";

export interface IChatService {
  listChats: () => Promise<Chats>;
  createChat: (chatCreateData: ChatCreateData) => Promise<Chat>;
  getChat: (id: number) => Promise<Chat>;
  deleteChat: (id: number) => Promise<void>;
}

export function createChatController(service: IChatService, jwtSecret: string): Router {
  const router = express.Router();

  router.get("/chats", async (req, res) => {
    try {
      const authorization = getAuthorization<AuthorizationData>(req, jwtSecret);
      if (!authorization) {
        res.status(403).send("forbidden");
        return;
      }
      const result = await service.listChats();
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  router.post("/chats", async (req, res) => {
    try {
      const authorization = getAuthorization<AuthorizationData>(req, jwtSecret);
      if (!authorization) {
        res.status(403).send("forbidden");
        return;
      }
      const chatCreateData = req.body as ChatCreateData;
      const result = await service.createChat(chatCreateData);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  router.get("/chats/:id", async (req, res) => {
    try {
      const authorization = getAuthorization<AuthorizationData>(req, jwtSecret);
      if (!authorization) {
        res.status(403).send("forbidden");
        return;
      }
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
      const authorization = getAuthorization<AuthorizationData>(req, jwtSecret);
      if (!authorization) {
        res.status(403).send("forbidden");
        return;
      }
      const id = parseInt(req.params.id as string, 10);
      await service.deleteChat(id);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  return router;
}
