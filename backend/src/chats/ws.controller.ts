import express, { Router } from "express";
import "express-ws";
import jwt from "jsonwebtoken";
import WS from "ws";
import { IUserService } from "../api/user-controller";

interface IUserInfo {
  userId: number;
}

interface IClient {
  username: string;
  ws: WS;
}

interface ITokenAction {
  type: "TOKEN";
  token: string;
}

interface IMessageAction {
  type: "MESSAGE";
  from: string;
  chatId: number;
  content: string;
}

type Action = ITokenAction | IMessageAction;

const clients: IClient[] = [];

function addClient(username: string, ws: WS): IClient {
  const client = { username, ws };
  clients.push(client);
  return client;
}

function removeClient(client: IClient): void {
  const index = clients.indexOf(client);
  clients.splice(index, 1);
}

function handleAction(client: IClient, action: Action): void {
  if (action.type === "MESSAGE") {
    action = { ...action, from: client.username };
  }
  const msg = JSON.stringify(action);
  clients.forEach((c) => {
    if (c !== client) {
      c.ws.send(msg);
    }
  });
}

export default function creatWsController(userService: IUserService, jwtSecret: string): Router {
  const router = express.Router();

  router.ws("/", (ws, _) => {
    let client: IClient | undefined;

    ws.on("message", async (msg) => {
      const msgStr = msg.toString();
      const action: Action = JSON.parse(msgStr);
      if (client) {
        handleAction(client, action);
      } else if (action.type === "TOKEN") {
        const userInfo = jwt.verify(action.token, jwtSecret) as IUserInfo;
        const user = await userService.getUser(userInfo);
        if (user) {
          client = addClient(user.username, ws);
        } else {
          console.warn("unauthorized msg: " + msgStr);
          ws.close();
        }
      } else {
        console.warn("unauthorized msg: " + msgStr);
        ws.close();
      }
    });

    ws.on("close", () => {
      if (client) {
        removeClient(client);
      }
    });
  });

  return router;
}
