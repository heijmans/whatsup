// auto generated, do not edit

// tslint:disable: array-type

import { checkResponse, jsonBody, jwtHeaders } from "../lib/api-service-helpers";
import { ILoginResult, IUser, IUserLoginData, IUserRegisterData } from "./api-types";

const userService = {
  async getUser(token: string): Promise<IUser> {
    const response = await fetch(`/api/user`, {
      headers: { ...jwtHeaders(token) },
      method: "GET",
    });
    checkResponse(response);
    return await response.json();
  },

  async registerUser(userRegisterData: IUserRegisterData): Promise<IUser> {
    const response = await fetch(`/api/user/register`, {
      body: JSON.stringify(userRegisterData),
      headers: { ...jsonBody() },
      method: "POST",
    });
    checkResponse(response);
    return await response.json();
  },

  async login(userLoginData: IUserLoginData): Promise<ILoginResult> {
    const response = await fetch(`/api/user/login`, {
      body: JSON.stringify(userLoginData),
      headers: { ...jsonBody() },
      method: "POST",
    });
    checkResponse(response);
    return await response.json();
  },
};

export default userService;
