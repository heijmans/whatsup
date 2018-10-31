// auto generated from openapi/swagger schema, do not edit

import { checkResponse, jsonBodyHeaders, jwtHeaders } from "../lib/api-service-helpers";
import { IUser, IUserLoginData, IUserLoginResult, IUserRegisterData } from "./api-types";

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
      headers: { ...jsonBodyHeaders() },
      method: "POST",
    });
    checkResponse(response);
    return await response.json();
  },

  async login(userLoginData: IUserLoginData): Promise<IUserLoginResult> {
    const response = await fetch(`/api/user/login`, {
      body: JSON.stringify(userLoginData),
      headers: { ...jsonBodyHeaders() },
      method: "POST",
    });
    checkResponse(response);
    return await response.json();
  },

};

export default userService;
