import { AppAction } from "./actions";
import {
  MESSAGE,
  RECEIVE_CHATS,
  RECEIVE_CREATE_CHAT,
  RECEIVE_DELETE_CHAT,
  REQUEST_CHATS,
  REQUEST_CREATE_CHAT,
  REQUEST_DELETE_CHAT,
} from "./chat.actions";
import { IMessageAction } from "./chat.service";
import { IChat, ILoadEntry, IMessage, IMessagesState } from "./state";
import { REQUEST_LOGOUT_USER } from "./user.actions";

export function chatReducer(
  state: ILoadEntry<IChat[]> = {},
  action: AppAction,
): ILoadEntry<IChat[]> {
  if (action.type === REQUEST_CHATS) {
    return { isFetching: true };
  } else if (action.type === RECEIVE_CHATS) {
    return { data: action.data };
  } else if (action.type === REQUEST_CREATE_CHAT) {
    return { isFetching: true };
  } else if (action.type === RECEIVE_CREATE_CHAT) {
    return state; // we'll reload the chat list
  } else if (action.type === REQUEST_DELETE_CHAT) {
    return { isFetching: true };
  } else if (action.type === RECEIVE_DELETE_CHAT) {
    return state; // we'll reload the chat list
  } else if (action.type === REQUEST_LOGOUT_USER) {
    return {};
  } else {
    return state;
  }
}

function addMessage(messages: IMessage[], action: IMessageAction) {
  const { uuid } = action;
  if (messages.find((m) => m.uuid === uuid)) {
    return messages;
  } else {
    return messages.concat(action);
  }
}

export function messageReducer(state: IMessagesState = {}, action: AppAction): IMessagesState {
  if (action.type === MESSAGE) {
    const { chatId } = action;
    const messages = state[chatId] || [];
    return { ...state, [chatId]: addMessage(messages, action) };
  } else {
    return state;
  }
}
