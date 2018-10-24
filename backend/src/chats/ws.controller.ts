import express from "express";
import "express-ws";
import jwt from "jsonwebtoken";
import WS from "ws";
import secrets from "../../config/secrets";
import User from "../users/user.model";

interface IUserInfo {
  userId: number;
}

interface IClient {
  user: User;
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

function addClient(user: User, ws: WS): IClient {
  const client = { user, ws };
  clients.push(client);
  return client;
}

function removeClient(client: IClient) {
  const index = clients.indexOf(client);
  clients.splice(index, 1);
}

function handleAction(client: IClient, action: Action) {
  if (action.type === "MESSAGE") {
    action = { ...action, from: client.user.username };
    const msg = JSON.stringify(action);
    clients.forEach(({ ws }) => {
      ws.send(msg);
    });
  }
}

const wsRouter = express.Router();

wsRouter.ws("/", (ws, _) => {
  let client: IClient | undefined;

  ws.on("message", async (msg) => {
    const msgStr = msg.toString();
    const action: Action = JSON.parse(msgStr);
    if (client) {
      handleAction(client, action);
    } else if (action.type === "TOKEN") {
      const userInfo = jwt.verify(action.token, secrets.jwt) as IUserInfo;
      const user = await User.findById(userInfo.userId);
      if (user) {
        client = addClient(user, ws);
      } else {
        console.log("unauthorized msg: " + msgStr);
        ws.close();
      }
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
