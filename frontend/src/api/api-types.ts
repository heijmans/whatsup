// auto generated, do not edit

// tslint:disable: array-type interface-name

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

export interface ILoginResult {
  success: boolean;
  token?: string;
}

export type IChats = Array<IChat>;

export interface IChat {
  id: number;
  name: string;
  unread?: number;
}

export interface IChatCreateData {
  name: string;
}
