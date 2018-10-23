import jwt from "jsonwebtoken";
import "express-jwt"; // ts-node must pickup the type of req.user
import express from "express";
import secrets from "../../config/secrets.json";
import User from "../models/user.model";

function cleanUser({ id, username }: User) {
  return { id, username };
}

const router = express.Router();
router.get("/", (req, res) => {
  const { userId } = req.user!;
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

interface IUserRegister {
  username: string;
  password: string;
}

router.post("/register", (req, res) => {
  const { username, password }: IUserRegister = req.body;
  User.create({ username, password })
    .then((user) => {
      res.json(cleanUser(user));
    })
    .catch((e) => {
      res.status(500).send(e.toString());
    });
});

interface IUserLogin {
  username: string;
  password: string;
}

router.post("/login", (req, res) => {
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

export default router;
