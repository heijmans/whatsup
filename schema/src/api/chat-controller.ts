// auto generated, do not edit

// tslint:disable: array-type

import express, { Router } from "express";
import { getAuthorization } from "../lib/api-controller-helpers";
import { IChat, IChatCreateData, IChats } from "./api-types";

export interface IChatService {
  listChats: () => Promise<IChats>;
  createChat: (iChatCreateData: IChatCreateData) => Promise<IChat>;
  getChat: (id: number) => Promise<IChat>;
  deleteChat: (id: number) => Promise<void>;
}

export default function createChatController(service: IChatService, jwtSecret: string): Router {
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
      const iChatCreateData = req.body as IChatCreateData;
      const result = await service.createChat(iChatCreateData);
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
