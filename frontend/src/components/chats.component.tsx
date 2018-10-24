import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getChats } from "../state/selectors";
import { IChat, IState } from "../state/state";

interface IChatsConnState {
  chats?: IChat[];
}

export function Chats({ chats }: IChatsConnState): ReactElement<HTMLElement> {
  if (!chats) {
    return <h3>Loading...</h3>;
  }

  return (
    <div>
      <h1>Chats</h1>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link to={`/chats/${chat.id}`}>{chat.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = (state: IState): IChatsConnState => ({
  chats: getChats(state),
});

export default connect<IChatsConnState, {}, {}, IState>(mapStateToProps)(Chats);
