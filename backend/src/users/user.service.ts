import jwt from "jsonwebtoken";
import secrets from "../../config/secrets";
import {
  IAuthorizationData,
  IUser,
  IUserLoginData,
  IUserLoginResult,
  IUserRegisterData,
} from "../api/api-types";
import User from "./user.model";

function toIUser({ id, username }: User): IUser {
  return { id, username };
}

const userService = {
  async getUser({ userId }: IAuthorizationData): Promise<IUser> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("not found");
    }
    return toIUser(user);
  },

  async registerUser(data: IUserRegisterData): Promise<IUser> {
    return toIUser(await User.create(data));
  },

  async login({ username, password }: IUserLoginData): Promise<IUserLoginResult> {
    const user = await User.login(username, password);
    if (user) {
      const token = jwt.sign({ userId: user.id }, secrets.jwt);
      return { success: true, token };
    } else {
      return { success: false };
    }
  },
};

export default userService;
