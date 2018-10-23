import express from "express";
import expressJwt from "express-jwt";
import bodyParser from "body-parser";
import "./models/db";
import User from "./models/user.model";
import jwt from "jsonwebtoken";
import secrets from "./config/secrets";

interface IUserRegister {
  username: string;
  password: string;
}

interface IUserLogin {
  username: string;
  password: string;
}

const app = express();
app.use(bodyParser.json());

app.use(
  expressJwt({ secret: secrets.jwt }).unless({
    path: ["/user/register", "/user/login"],
  }),
);

function cleanUser({ id, username }: User) {
  return { id, username };
}

app.get("/user", (req, res) => {
  const { userId } = req.user;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(cleanUser(user));
      } else {
        res.status(403).send("invalid credentials");
      }
    })
    .catch((e) => {
      res.status(500).send(e.toString());
    });
});

app.post("/user/register", (req, res) => {
  const { username, password }: IUserRegister = req.body;
  User.create({ username, password })
    .then((user) => {
      res.json(cleanUser(user));
    })
    .catch((e) => {
      res.status(500).send(e.toString());
    });
});

app.post("/user/login", (req, res) => {
  const { username, password }: IUserLogin = req.body;
  User.findOne({ where: { username } })
    .then((user) => {
      if (user && user.validatePassword(password)) {
        const token = jwt.sign({ userId: user.id }, secrets.jwt, {
          expiresIn: "1h",
        });
        res.send({ success: true, token });
      } else {
        res.status(403).send("invalid credentials");
      }
    })
    .catch((e) => {
      res.status(500).send(e.toString());
    });
});

console.log("http://localhost:4000");
app.listen(4000);
