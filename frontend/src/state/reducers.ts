import { combineReducers } from "redux";
import { AppAction } from "./actions";
import { chatReducer, messageReducer } from "./chat.reducers";
import { IState } from "./state";
import { tokenReducer, userReducer } from "./user.reducers";

export default combineReducers<IState, AppAction>({
  chats: chatReducer,
  messagesByChatId: messageReducer,
  token: tokenReducer,
  user: userReducer,
});
