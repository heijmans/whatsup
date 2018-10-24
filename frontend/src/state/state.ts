export interface ILoadEntry<Data> {
  isFetching?: boolean;
  data?: Data;
}

export interface IUser {
  id: number;
  username: string;
}

export interface IMessage {
  uuid: string;
  from?: string;
  chatId: number;
  content: string;
}

export interface IChat {
  id: number;
  name: string;
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
