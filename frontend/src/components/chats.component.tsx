import React, { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AppThunkDispatch } from "../state/actions";
import { createChat, deleteChat } from "../state/chat.actions";
import { getChats, getUnread } from "../state/selectors";
import { IChat, IState } from "../state/state";
import { logoutUser } from "../state/user.actions";

interface IChatsConnState {
  unread?: number;
  chats?: IChat[];
}

interface IChatsConnActions {
  logoutUser: () => void;
  createChat: (name: string) => void;
  deleteChat: (chatId: number) => void;
}

interface IChatsState {
  newName: string;
}

export class Chats extends Component<IChatsConnState & IChatsConnActions, IChatsState> {
  constructor(props: IChatsConnState & IChatsConnActions) {
    super(props);
    this.state = { newName: "" };
  }

  public render(): ReactNode {
    const { chats, logoutUser: logout, unread } = this.props;
    if (!chats) {
      return <h3>Loading...</h3>;
    }

    const { newName } = this.state;
    return (
      <div>
        <div className="header">
          <div className="header-item">{!!unread && <div className="unread">{unread}</div>}</div>
          <h1 className="header-title">Chats</h1>
          <a className="header-button" onClick={logout}>
            Logout
          </a>
        </div>
        <div className="list">
          {chats.map((chat) => (
            <div className="item" key={chat.id}>
              <Link className="item-title" to={`/chats/${chat.id}`}>
                {chat.name}
                {!!chat.unread && <div className="unread">{chat.unread}</div>}
              </Link>
              <a className="item-delete" onClick={() => this.handleDelete(chat)}>
                X
              </a>
            </div>
          ))}
        </div>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          <input onChange={this.handleNameChange} value={newName} />
          <button>Add</button>
        </form>
      </div>
    );
  }

  private readonly handleDelete = (chat: IChat): void => {
    if (confirm(`Are you sure you want to delete the chat ${chat.name}?`)) {
      this.props.deleteChat(chat.id);
    }
  };

  private readonly handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newName: event.currentTarget.value });
  };

  private readonly handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { newName } = this.state;
    this.props.createChat(newName);
    this.setState({ newName: "" });
  };
}

const mapStateToProps = (state: IState): IChatsConnState => ({
  chats: getChats(state),
  unread: getUnread(state),
});

const mapDispatchToProps = (dispatch: AppThunkDispatch): IChatsConnActions => ({
  createChat: (name: string) => {
    dispatch(createChat(name));
  },
  deleteChat: (chatId: number) => {
    dispatch(deleteChat(chatId));
  },
  logoutUser: () => {
    dispatch(logoutUser());
  },
});

export default connect<IChatsConnState, IChatsConnActions, {}, IState>(
  mapStateToProps,
  mapDispatchToProps,
)(Chats);
