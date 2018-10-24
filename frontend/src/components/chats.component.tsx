import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AppThunkDispatch } from "../state/actions";
import { getChats } from "../state/selectors";
import { IChat, IState } from "../state/state";
import { logoutUser } from "../state/user.actions";

interface IChatsConnState {
  chats?: IChat[];
}

interface IChatsConnActions {
  logoutUser: () => void;
}

export function Chats({
  chats,
  logoutUser: logout,
}: IChatsConnState & IChatsConnActions): ReactElement<HTMLElement> {
  if (!chats) {
    return <h3>Loading...</h3>;
  }

  return (
    <div>
      <a onClick={logout}>Logout</a>
      <h1>Chats</h1>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link to={`/chats/${chat.id}`}>
              {chat.name}
              {chat.unread ? ` (${chat.unread})` : ""}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = (state: IState): IChatsConnState => ({
  chats: getChats(state),
});

const mapDispatchToProps = (dispatch: AppThunkDispatch): IChatsConnActions => ({
  logoutUser: () => {
    dispatch(logoutUser());
  },
});

export default connect<IChatsConnState, IChatsConnActions, {}, IState>(
  mapStateToProps,
  mapDispatchToProps,
)(Chats);
