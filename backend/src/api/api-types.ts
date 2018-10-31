// auto generated from openapi/swagger schema, do not edit

export interface IAuthorizationData {
  userId: number;
}

export interface IUser {
  id: number;
  username: string;
}

export interface IUserRegisterData {
  username: string;
  password: string;
}

export interface IUserLoginData {
  username: string;
  password: string;
}

export interface IUserLoginResult {
  success: boolean;
  token?: string;
}

export type IChats = IChat[];

export interface IChat {
  id: number;
  name: string;
  unread?: number;
}

export interface IChatCreateData {
  name: string;
}
