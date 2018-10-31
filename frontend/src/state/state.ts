import { IChat, IUser } from "../api/api-types";
export { IChat, IUser } from "../api/api-types";

export interface ILoadEntry<Data> {
  isFetching?: boolean;
  data?: Data;
}

export interface IMessage {
  from?: string;
  chatId: number;
  content: string;
}

export interface IMessagesState {
  [chatId: number]: IMessage[] | undefined;
}

export interface IState {
  token: string | null;
  user: ILoadEntry<IUser>;
  chats: ILoadEntry<IChat[]>;
  messagesByChatId: IMessagesState;
}
