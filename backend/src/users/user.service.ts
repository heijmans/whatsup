import jwt from "jsonwebtoken";
import secrets from "../../config/secrets";
import { IAuthorizationData, ILoginResult, IUser, IUserLoginData, IUserRegisterData } from "../api/api-types";
import User from "./user.model";

function toIUser({ id, username }: User): IUser {
  return { id, username };
}

const userService = {
  async getUser(authorization: IAuthorizationData): Promise<IUser> {
    const user = await User.findById(authorization.userId);
    if (!user) {
      throw new Error("not found");
    }
    return toIUser(user);
  },

  async registerUser(userRegisterData: IUserRegisterData): Promise<IUser> {
    return toIUser(await User.create(userRegisterData));
  },

  async login({ username, password }: IUserLoginData): Promise<ILoginResult> {
    const user = await User.login(username, password);
    if (user) {
      const authorization = { userId: user.id };
      const token = jwt.sign(authorization, secrets.jwt);
      return { success: true, token };
    } else {
      return { success: false };
    }
  },

};

export default userService;
