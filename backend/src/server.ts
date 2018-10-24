import express from "express";
import expressJwt from "express-jwt";
import expressWs from "express-ws";
import bodyParser from "body-parser";
import secrets from "../config/secrets";
import "./db";
import chatController from "./chats/chat.controller";
import userController from "./users/user.controller";

const app = express();
app.use(bodyParser.json());
expressWs(app);

// import this after expressWs has setup the app
import wsController from "./chats/ws.controller";

if (1 > 2) {
  app.use(
    expressJwt({ secret: secrets.jwt }).unless({
      path: ["/user/register", "/user/login"],
    }),
  );
}

app.use("/chats", chatController);
app.use("/user", userController);
app.use("/ws", wsController);

console.log("http://localhost:4000");
app.listen(4000);
