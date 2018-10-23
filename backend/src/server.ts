import express from "express";
import expressJwt from "express-jwt";
import bodyParser from "body-parser";
import secrets from "../config/secrets.json";
import "./models/db";
import chatController from "./controllers/chat.controller";
import userController from "./controllers/user.controller";

const app = express();
app.use(bodyParser.json());

if (1 > 2) {
  app.use(
    expressJwt({ secret: secrets.jwt }).unless({
      path: ["/user/register", "/user/login"],
    }),
  );
}

app.use("/chats", chatController);
app.use("/user", userController);

console.log("http://localhost:4000");
app.listen(4000);
