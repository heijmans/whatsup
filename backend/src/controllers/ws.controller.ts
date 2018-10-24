import express from "express";
import "express-ws";
import jwt from "jsonwebtoken";
import ws from "ws";
import secrets from "../../config/secrets";

interface IUserInfo {
  userId: number;
}

interface IClient {
  userInfo: IUserInfo;
  ws: ws;
}

interface ITokenAction {
  type: "TOKEN";
  token: string;
}

interface IMessageAction {
  type: "MESSAGE";
  userId?: number;
  chatId: number;
  content: string;
}

type Action = ITokenAction | IMessageAction;

const clients: IClient[] = [];

function addClient(userInfo: IUserInfo, ws: ws): IClient {
  const client = { userInfo, ws };
  clients.push(client);
  return client;
}

function removeClient(client: IClient) {
  const index = clients.indexOf(client);
  clients.splice(index, 1);
}

function handleAction(client: IClient, action: Action) {
  if (action.type === "MESSAGE") {
    action = { ...action, userId: client.userInfo.userId };
    const msg = JSON.stringify(action);
    clients.forEach((client) => {
      client.ws.send(msg);
    });
  }
}

const wsRouter = express.Router();

wsRouter.ws("/", (ws, _) => {
  let client: IClient | undefined;

  ws.on("message", (msg) => {
    const msgStr = msg.toString();
    const action: Action = JSON.parse(msgStr);
    if (client) {
      handleAction(client, action);
    } else if (action.type === "TOKEN") {
      const userInfo = jwt.verify(action.token, secrets.jwt) as IUserInfo;
      client = addClient(userInfo, ws);
    } else {
      console.log("unauthorized msg: " + msgStr);
      ws.close();
    }
  });

  ws.on("close", () => {
    if (client) {
      removeClient(client);
    }
  });
});

export default wsRouter;
