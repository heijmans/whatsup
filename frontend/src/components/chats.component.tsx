import React, { ReactElement } from "react";
import { IChat, ILoadEntry } from "../state/state";

interface IChatsConnState {
  chats: ILoadEntry<IChat[]>;
}

export function Chats({ chats }: IChatsConnState): ReactElement<HTMLElement> {
  return <h1>Chats: {chats.isFetching}</h1>;
}

export default Chats;
