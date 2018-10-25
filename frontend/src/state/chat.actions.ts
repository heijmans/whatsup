import { SimpleThunkAction } from "../lib/types";
import { AppAction } from "./actions";
import chatService from "./chat.service";
import { getTokenOrThrow } from "./selectors";
import { IChat, IState } from "./state";

// get chats

export interface IRequestChats {
  type: "REQUEST_CHATS";
}

export const REQUEST_CHATS = "REQUEST_CHATS";

export function requestChats(): IRequestChats {
  return { type: REQUEST_CHATS };
}

export interface IReceiveChats {
  type: "RECEIVE_CHATS";
  data: IChat[];
}

export const RECEIVE_CHATS = "RECEIVE_CHATS";

export function receiveChats(data: IChat[]): IReceiveChats {
  return { type: RECEIVE_CHATS, data };
}

export function fetchChats(): SimpleThunkAction<IState> {
  return async (dispatch, getState) => {
    const token = getTokenOrThrow(getState());
    dispatch(requestChats());
    const chats = await chatService.all(token);
    dispatch(receiveChats(chats));
  };
}

// create chat

export interface IRequestCreateChat {
  type: "REQUEST_CREATE_CHAT";
  name: string;
}

export const REQUEST_CREATE_CHAT = "REQUEST_CREATE_CHAT";

export function requestCreateChat(name: string): IRequestCreateChat {
  return { type: REQUEST_CREATE_CHAT, name };
}

export interface IReceiveCreateChat {
  type: "RECEIVE_CREATE_CHAT";
  data: IChat;
}

export const RECEIVE_CREATE_CHAT = "RECEIVE_CREATE_CHAT";

export function receiveCreateChat(data: IChat): IReceiveCreateChat {
  return { type: RECEIVE_CREATE_CHAT, data };
}

export function createChat(name: string): SimpleThunkAction<IState> {
  return async (dispatch, getState) => {
    const token = getTokenOrThrow(getState());
    dispatch(requestCreateChat(name));
    const chat = await chatService.create(token, name);
    dispatch(receiveCreateChat(chat));
    dispatch(refresh());
  };
}

// delete chat

export interface IRequestDeleteChat {
  type: "REQUEST_DELETE_CHAT";
  id: number;
}

export const REQUEST_DELETE_CHAT = "REQUEST_DELETE_CHAT";

export function requestDeleteChat(id: number): IRequestDeleteChat {
  return { type: REQUEST_DELETE_CHAT, id };
}

export interface IReceiveDeleteChat {
  type: "RECEIVE_DELETE_CHAT";
  id: number;
}

export const RECEIVE_DELETE_CHAT = "RECEIVE_DELETE_CHAT";

export function receiveDeleteChat(id: number): IReceiveDeleteChat {
  return { type: RECEIVE_DELETE_CHAT, id };
}

export function deleteChat(id: number): SimpleThunkAction<IState> {
  return async (dispatch, getState) => {
    const token = getTokenOrThrow(getState());
    dispatch(requestDeleteChat(id));
    await chatService.delete(token, id);
    dispatch(receiveDeleteChat(id));
    dispatch(refresh());
  };
}

// websocket

export interface IConnected {
  type: "CONNECTED";
}

export const CONNECTED = "CONNECTED";

export function connected(): IConnected {
  return { type: CONNECTED };
}

export interface IDisconnected {
  type: "DISCONNECTED";
}

export const DISCONNECTED = "DISCONNECTED";

export function disconnected(): IDisconnected {
  return { type: DISCONNECTED };
}

export interface IMessageAction {
  type: "MESSAGE";
  from?: string;
  chatId: number;
  content: string;
}

export const MESSAGE = "MESSAGE";

export function messageAction(chatId: number, content: string): IMessageAction {
  return { type: MESSAGE, chatId, content };
}

let ws: WebSocket | undefined;

export function connect(): SimpleThunkAction<IState> {
  return async (dispatch, getState) => {
    if (ws) {
      dispatch(disconnected());
      ws.close();
      ws = undefined;
    }
    const token = getTokenOrThrow(getState());
    ws = await chatService.connect(token);
    dispatch(connected());

    ws.addEventListener("message", (event) => {
      const action: AppAction = JSON.parse(event.data);
      if (action.type === MESSAGE) {
        dispatch(action);
      } else if (action.type === REFRESH) {
        dispatch(fetchChats());
      }
    });

    ws.addEventListener("close", () => {
      dispatch(disconnected);
      ws = undefined;
    });
  };
}

export function sendMessage(chatId: number, content: string): SimpleThunkAction<IState> {
  return (dispatch) => {
    if (ws) {
      const message = messageAction(chatId, content);
      chatService.sendAction(ws, message);
      dispatch(message);
    } else {
      throw new Error("websocket closed, could not send message");
    }
  };
}

export interface IRefresh {
  type: "REFRESH";
}

export const REFRESH = "REFRESH";

export function refreshAction(): IRefresh {
  return { type: REFRESH };
}

export function refresh(): SimpleThunkAction<IState> {
  return (_) => {
    if (ws) {
      chatService.sendAction(ws, refreshAction());
    } else {
      throw new Error("websocket closed, could not send message");
    }
  };
}

export function disconnect(): SimpleThunkAction<IState> {
  return (dispatch) => {
    if (ws) {
      dispatch(disconnected());
      ws.close();
      ws = undefined;
    }
  };
}

// read chat

export interface IReadChat {
  type: "READ_CHAT";
  chatId: number;
}

export const READ_CHAT = "READ_CHAT";

export function readChat(chatId: number): IReadChat {
  return { type: READ_CHAT, chatId };
}

export type ChatActions =
  | IRequestChats
  | IReceiveChats
  | IRequestCreateChat
  | IReceiveCreateChat
  | IRequestDeleteChat
  | IReceiveDeleteChat
  | IConnected
  | IDisconnected
  | IMessageAction
  | IRefresh
  | IReadChat;
