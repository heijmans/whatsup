import React, { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AppThunkDispatch } from "../state/actions";
import { createChat, deleteChat } from "../state/chat.actions";
import { getChats } from "../state/selectors";
import { IChat, IState } from "../state/state";
import { logoutUser } from "../state/user.actions";

interface IChatsConnState {
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
    const { chats, logoutUser: logout } = this.props;
    if (!chats) {
      return <h3>Loading...</h3>;
    }

    const { newName } = this.state;
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
              </Link>{" "}
              <a onClick={() => this.handleDelete(chat)}>X</a>
            </li>
          ))}
        </ul>
        <form onSubmit={this.handleSubmit}>
          <p>
            <input onChange={this.handleNameChange} value={newName} />
            <button>Add</button>
          </p>
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
