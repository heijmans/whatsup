// auto generated, do not edit

// tslint:disable: array-type

import express, { Router } from "express";
import { LoginResult, User, UserLogin, UserRegister } from "./api-types";

export interface IUserService {
  getUser: (token: string) => Promise<User>;
  registerUser: (body: UserRegister) => Promise<User>;
  login: (body: UserLogin) => Promise<LoginResult>;
}

export function createUserController(service: IUserService): Router {
  const router = express.Router();

  router.get("/user", async (req, res) => {
    try {
      const token = req.headers.token as string;
      const result = await service.getUser(token);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  router.post("/user/register", async (req, res) => {
    try {
      const body = req.body as UserRegister;
      const result = await service.registerUser(body);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  router.post("/user/login", async (req, res) => {
    try {
      const body = req.body as UserLogin;
      const result = await service.login(body);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  return router;
}
