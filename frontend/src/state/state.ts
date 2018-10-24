export interface ILoadEntry<Data> {
  isFetching?: boolean;
  data?: Data;
}

export interface IUser {
  id: number;
  username: string;
}

export interface IMessage {
  from: string;
  chatId: number;
  content: string;
}

export interface IChat {
  id: number;
  name: string;
}

export interface IState {
  token?: string;
  user?: IUser;
  chatIds: number[];
  chatById: { [id: number]: IChat | undefined };
}
