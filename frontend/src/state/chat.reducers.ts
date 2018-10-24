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
import { IChat, IChatState, ILoadEntry } from "./state";
import { REQUEST_LOGOUT_USER } from "./user.actions";

function addMessage(chat: IChat, action: IMessageAction): IChat {
  const { uuid } = action;
  const messages = chat.messages || [];
  if (messages.find((m) => m.uuid === uuid)) {
    return chat;
  } else {
    return { ...chat, messages: messages.concat(action) };
  }
}

const INITIAL_STATE = { ids: {}, byId: {} };

export default function reduce(state: IChatState = INITIAL_STATE, action: AppAction): IChatState {
  if (action.type === REQUEST_CHATS) {
    return { ...state, ids: { isFetching: true } };
  } else if (action.type === RECEIVE_CHATS) {
    const ids: number[] = [];
    const byId: { [id: number]: ILoadEntry<IChat> | undefined } = {};
    action.data.forEach((chat) => {
      ids.push(chat.id);
      byId[chat.id] = { data: chat };
    });
    return { byId, ids: { data: ids } };
  } else if (action.type === REQUEST_CREATE_CHAT) {
    return { ...state, isFetching: true };
  } else if (action.type === RECEIVE_CREATE_CHAT) {
    return state; // we'll reload the chat list
  } else if (action.type === REQUEST_DELETE_CHAT) {
    return { ...state, isFetching: true };
  } else if (action.type === RECEIVE_DELETE_CHAT) {
    return state; // we'll reload the chat list
  } else if (action.type === REQUEST_LOGOUT_USER) {
    return INITIAL_STATE;
  } else if (action.type === MESSAGE) {
    const { chatId } = action;
    const chat = state.byId[chatId];
    if (chat && chat.data) {
      const newChat = addMessage(chat.data, action);
      return { ...state, byId: { ...state.byId, [chatId]: { data: newChat } } };
    } else {
      return state;
    }
  } else {
    return state;
  }
}
