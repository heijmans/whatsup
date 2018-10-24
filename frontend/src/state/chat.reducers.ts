import { AppAction } from "./actions";
import {
  RECEIVE_CHATS,
  RECEIVE_CREATE_CHAT,
  RECEIVE_DELETE_CHAT,
  REQUEST_CHATS,
  REQUEST_CREATE_CHAT,
  REQUEST_DELETE_CHAT,
} from "./chat.actions";
import { IChat, IChatState, ILoadEntry } from "./state";

export default function reduce(
  state: IChatState = { ids: {}, byId: {} },
  action: AppAction,
): IChatState {
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
  } else {
    return state;
  }
}
