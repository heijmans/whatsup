import express from "express";
import "express-jwt"; // ts-node must pickup the type of req.user
import jwt from "jsonwebtoken";
import secrets from "../../config/secrets";
import User from "./user.model";

interface IUserView {
  id: number;
  username: string;
}

function cleanUser({ id, username }: User): IUserView {
  return { id, username };
}

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { userId } = req.user!;
    const user = await User.findById(userId);
    if (user) {
      res.json(cleanUser(user));
    } else {
      res.status(403).send("invalid credentials");
    }
  } catch (e) {
    console.warn(e);
    res.status(500).send(e.toString());
  }
});

interface IUserRegister {
  username: string;
  password: string;
}

router.post("/register", async (req, res) => {
  try {
    const { username, password }: IUserRegister = req.body;
    const user = await User.create({ username, password });
    res.json(cleanUser(user));
  } catch (e) {
    console.warn(e);
    res.status(500).send(e.toString());
  }
});

interface IUserLogin {
  username: string;
  password: string;
}

router.post("/login", async (req, res) => {
  try {
    const { username, password }: IUserLogin = req.body;
    const user = await User.login(username, password);
    if (user) {
      const token = jwt.sign({ userId: user.id }, secrets.jwt, {
        expiresIn: "1h",
      });
      res.json({ success: true, token });
    } else {
      res.status(403).send("invalid credentials");
    }
  } catch (e) {
    console.warn(e);
    res.status(500).send(e.toString());
  }
});

export default router;
