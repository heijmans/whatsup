import { SimpleThunkAction } from "../lib/types";
import { getTokenOrThrow } from "./selectors";
import { IState, IUser } from "./state";
import userService from "./user.service";

// get user

export interface IRequestUser {
  type: "REQUEST_USER";
}

export const REQUEST_USER = "REQUEST_USER";

export function requestUser(): IRequestUser {
  return { type: REQUEST_USER };
}

export interface IReceiveUser {
  type: "RECEIVE_USER";
  data: IUser;
}

export const RECEIVE_USER = "RECEIVE_USER";

export function receiveUser(data: IUser): IReceiveUser {
  return { type: RECEIVE_USER, data };
}

export function fetchUser(): SimpleThunkAction<IState> {
  return async (dispatch, getState) => {
    const token = getTokenOrThrow(getState());
    dispatch(requestUser());
    const user = await userService.get(token);
    dispatch(receiveUser(user));
  };
}

// register

export interface IRequestRegisterUser {
  type: "REQUEST_REGISTER_USER";
  username: string;
  password: string;
}

export const REQUEST_REGISTER_USER = "REQUEST_REGISTER_USER";

export function requestRegisterUser(username: string, password: string): IRequestRegisterUser {
  return { type: REQUEST_REGISTER_USER, username, password };
}

export interface IReceiveRegisterUser {
  type: "RECEIVE_REGISTER_USER";
  data: IUser;
}

export const RECEIVE_REGISTER_USER = "RECEIVE_REGISTER_USER";

export function receiveRegisterUser(data: IUser): IReceiveRegisterUser {
  return { type: RECEIVE_REGISTER_USER, data };
}

export function registerUser(username: string, password: string): SimpleThunkAction<IState> {
  return async (dispatch) => {
    dispatch(requestRegisterUser(username, password));
    const user = await userService.register(username, password);
    dispatch(receiveRegisterUser(user));
    dispatch(loginUser(username, password));
  };
}

// login

export interface IRequestLoginUser {
  type: "REQUEST_LOGIN_USER";
  username: string;
  password: string;
}

export const REQUEST_LOGIN_USER = "REQUEST_LOGIN_USER";

export function requestLoginUser(username: string, password: string): IRequestLoginUser {
  return { type: REQUEST_LOGIN_USER, username, password };
}

export interface IReceiveLoginUser {
  type: "RECEIVE_LOGIN_USER";
  token: string;
}

export const RECEIVE_LOGIN_USER = "RECEIVE_LOGIN_USER";

export function receiveLoginUser(token: string): IReceiveLoginUser {
  return { type: RECEIVE_LOGIN_USER, token };
}

export function loginUser(username: string, password: string): SimpleThunkAction<IState> {
  return async (dispatch) => {
    dispatch(requestLoginUser(username, password));
    const token = await userService.login(username, password);
    dispatch(receiveLoginUser(token));
    dispatch(fetchUser());
    dispatch(fetchChats());
  };
}

// logout

export interface IRequestLogoutUser {
  type: "REQUEST_LOGOUT_USER";
}

export const REQUEST_LOGOUT_USER = "REQUEST_LOGOUT_USER";

export function requestLogoutUser() {
  return { type: REQUEST_LOGOUT_USER };
}

export function logoutUser(): SimpleThunkAction<IState> {
  return async (dispatch) => {
    dispatch(requestLogoutUser());
    dispatch(disconnect());
  };
}

export type UserAction =
  | IRequestUser
  | IReceiveUser
  | IRequestRegisterUser
  | IReceiveRegisterUser
  | IRequestLoginUser
  | IReceiveLoginUser
  | IRequestLogoutUser;
