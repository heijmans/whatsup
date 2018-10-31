import bodyParser from "body-parser";
import express from "express";
import expressJwt from "express-jwt";
import expressWs from "express-ws";
import secrets from "../config/secrets";
import createChatController from "./api/chat-controller";
import createUserController from "./api/user-controller";
import chatService from "./chats/chat.service";
import "./db";
import userService from "./users/user.service";

const app = express();
app.use(bodyParser.json());
expressWs(app);

// import this after expressWs has setup the app
import wsController from "./chats/ws.controller";

app.use(
  "/api",
  expressJwt({ secret: secrets.jwt }).unless({
    path: ["/api/user/register", "/api/user/login"],
  }),
);

const apiRouter = express.Router();
apiRouter.use(createChatController(chatService, secrets.jwt));
apiRouter.use(createUserController(userService, secrets.jwt));
app.use("/api", apiRouter);

app.use("/ws", wsController);

const port = 4001;
console.log(`http://localhost:${port}`);
app.listen(port);
