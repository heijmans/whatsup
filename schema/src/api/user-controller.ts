// auto generated, do not edit

// tslint:disable: array-type

import express, { Router } from "express";
import { LoginResult, User, UserLogin, UserRegister } from "./api-types";

export interface IUserService {
  getUser: (authorization: string) => Promise<User>;
  registerUser: (userRegister: UserRegister) => Promise<User>;
  login: (userLogin: UserLogin) => Promise<LoginResult>;
}

export function createUserController(service: IUserService): Router {
  const router = express.Router();

  router.get("/user", async (req, res) => {
    try {
      const authorization = req.headers.authorization as string;
      const result = await service.getUser(authorization);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  router.post("/user/register", async (req, res) => {
    try {
      const userRegister = req.body as UserRegister;
      const result = await service.registerUser(userRegister);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  router.post("/user/login", async (req, res) => {
    try {
      const userLogin = req.body as UserLogin;
      const result = await service.login(userLogin);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  return router;
}
