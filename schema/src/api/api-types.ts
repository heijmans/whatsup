// auto generated, do not edit

// tslint:disable: array-type interface-name

export interface AuthorizationData {
  userId: number;
}

export interface User {
  id: number;
  username: string;
}

export interface UserRegisterData {
  username: string;
  password: string;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  token: string;
}

export type Chats = Array<Chat>;

export interface Chat {
  id: number;
  name: string;
}

export interface ChatCreateData {
  name: string;
}
