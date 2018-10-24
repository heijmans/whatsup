import { ChatActions } from "./chat.actions";
import { UserAction } from "./user.actions";

export type AppAction = ChatActions | UserAction;
