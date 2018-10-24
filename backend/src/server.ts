import bodyParser from "body-parser";
import express from "express";
import expressJwt from "express-jwt";
import expressWs from "express-ws";
import secrets from "../config/secrets";
import chatController from "./chats/chat.controller";
import "./db";
import userController from "./users/user.controller";

const app = express();
app.use(bodyParser.json());
expressWs(app);

// import this after expressWs has setup the app
import wsController from "./chats/ws.controller";

app.use(
  expressJwt({ secret: secrets.jwt }).unless({
    path: ["/api/user/register", "/api/user/login"],
  }),
);

const apiRouter = express.Router();
apiRouter.use("/chats", chatController);
apiRouter.use("/user", userController);
apiRouter.use("/ws", wsController);
app.use("/api", apiRouter);

const port = 4001;
console.log(`http://localhost:${port}`);
app.listen(port);
