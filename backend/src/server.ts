import bodyParser from "body-parser";
import express from "express";
import expressWs from "express-ws";
import secrets from "../config/secrets";
import createChatController from "./api/chat-controller";
import createUserController from "./api/user-controller";
import chatService from "./chats/chat.service";
import createWsController from "./chats/ws.controller";
import "./db";
import userService from "./users/user.service";

const app = express();
app.use(bodyParser.json());
expressWs(app);

const apiRouter = express.Router();
apiRouter.use(createChatController(chatService, secrets.jwt));
apiRouter.use(createUserController(userService, secrets.jwt));
app.use("/api", apiRouter);

app.use("/ws", createWsController(userService, secrets.jwt));

const port = 4001;
console.log(`http://localhost:${port}`);
app.listen(port);
