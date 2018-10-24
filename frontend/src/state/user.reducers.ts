import { AppAction } from "./actions";
import { ILoadEntry, IUser } from "./state";
import {
  RECEIVE_LOGIN_USER,
  RECEIVE_REGISTER_USER,
  RECEIVE_USER,
  REQUEST_LOGIN_USER,
  REQUEST_REGISTER_USER,
  REQUEST_USER,
} from "./user.actions";

export function userReducer(state: ILoadEntry<IUser> = {}, action: AppAction): ILoadEntry<IUser> {
  if (action.type === REQUEST_USER) {
    return { isFetching: true };
  } else if (action.type === RECEIVE_USER) {
    return { data: action.data };
  } else if (action.type === REQUEST_REGISTER_USER) {
    return { isFetching: true };
  } else if (action.type === RECEIVE_REGISTER_USER) {
    return {};
  } else if (action.type === REQUEST_LOGIN_USER) {
    return { isFetching: true };
  } else {
    return state;
  }
}

export function tokenReducer(state: string | null = null, action: AppAction): string | null {
  if (action.type === RECEIVE_LOGIN_USER) {
    return action.token;
  } else {
    return state;
  }
}
