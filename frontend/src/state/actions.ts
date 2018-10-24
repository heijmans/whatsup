import { SimpleThunkDispatch } from "../lib/types";
import { ChatActions } from "./chat.actions";
import { IState } from "./state";
import { UserAction } from "./user.actions";

export type AppAction = ChatActions | UserAction;

export type AppThunkDispatch = SimpleThunkDispatch<IState, AppAction>;
