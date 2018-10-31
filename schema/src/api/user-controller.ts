// auto generated, do not edit

// tslint:disable: array-type

import express, { Router } from "express";
import { getAuthorization } from "../lib/api-controller-helpers";
import { AuthorizationData, LoginResult, User, UserLoginData, UserRegisterData } from "./api-types";

export interface IUserService {
  getUser: (authorization: string) => Promise<User>;
  registerUser: (userRegisterData: UserRegisterData) => Promise<User>;
  login: (userLoginData: UserLoginData) => Promise<LoginResult>;
}

export function createUserController(service: IUserService, jwtSecret: string): Router {
  const router = express.Router();

  router.get("/user", async (req, res) => {
    try {
      const authorization = getAuthorization<AuthorizationData>(req, jwtSecret);
      if (!authorization) {
        res.status(403).send("forbidden");
        return;
      }
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
      const userRegisterData = req.body as UserRegisterData;
      const result = await service.registerUser(userRegisterData);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  router.post("/user/login", async (req, res) => {
    try {
      const userLoginData = req.body as UserLoginData;
      const result = await service.login(userLoginData);
      res.json(result);
    } catch (e) {
      console.warn(e);
      res.status(500).send(e.toString());
    }
  });

  return router;
}
