import jwt from "jsonwebtoken";
import secrets from "../../config/secrets";
import {
  IAuthorizationData,
  IUser,
  IUserLoginData,
  IUserLoginResult,
  IUserRegisterData,
} from "../api/api-types";
import { create, User, users } from "./db";

function toIUser({ $loki: id, username }: User): IUser {
  return { id, username };
}

const userService = {
  async getUser({ userId }: IAuthorizationData): Promise<IUser> {
    const user = users.get(userId);
    if (!user) {
      throw new Error("not found");
    }
    return toIUser(user);
  },

  async registerUser(data: IUserRegisterData): Promise<IUser> {
    return toIUser(create(users, data));
  },

  async login({ username, password }: IUserLoginData): Promise<IUserLoginResult> {
    const user = users.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ userId: user.$loki }, secrets.jwt);
      return { success: true, token };
    } else {
      return { success: false };
    }
  },
};

export default userService;
