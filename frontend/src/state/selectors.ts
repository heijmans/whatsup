import { IChat, IMessage, IState } from "./state";

export function getToken(state: IState): string | null {
  const { token } = state;
  return token;
}

export function getTokenOrThrow(state: IState): string {
  const token = getToken(state);
  if (!token) {
    throw new Error("unauthorized");
  }
  return token;
}

export function getChats(state: IState): IChat[] | undefined {
  const { chats } = state;
  return chats.isFetching ? undefined : chats.data;
}

export function getChat(state: IState, chatId: number): IChat | undefined {
  const chats = getChats(state);
  return chats ? chats.find((c) => c.id === chatId) : undefined;
}

export function getMessages(state: IState, chatId: number): IMessage[] {
  return state.messagesByChatId[chatId] || [];
}
