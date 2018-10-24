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
  messages?: IMessage[];
}

export interface IChatState {
  isFetching?: boolean;
  ids: ILoadEntry<number[]>;
  byId: { [id: number]: ILoadEntry<IChat> | undefined };
}

export interface IState {
  token: string | null;
  user: ILoadEntry<IUser>;
  chats: IChatState;
}
