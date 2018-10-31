// auto generated, do not edit

// tslint:disable: array-type interface-name

export interface User {
  id: number;
  username: string;
}

export interface UserRegister {
  username: string;
  password: string;
}

export interface UserLogin {
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

export interface ChatCreate {
  name: string;
}
