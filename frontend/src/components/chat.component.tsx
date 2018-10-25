import React, { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AppThunkDispatch } from "../state/actions";
import { readChat, sendMessage } from "../state/chat.actions";
import { getChat, getMessages, getUnread } from "../state/selectors";
import { IChat, IMessage, IState } from "../state/state";
import { logoutUser } from "../state/user.actions";

interface IChatProps {
  chatId: number;
}

interface IChatConnState {
  unread: number;
  chat: IChat | undefined;
  messages: IMessage[];
}

interface IChatConnActions {
  logoutUser: () => void;
  sendMessage: (content: string) => void;
  readChat: () => void;
}

interface IChatState {
  content: string;
}

export class Chat extends Component<IChatProps & IChatConnState & IChatConnActions, IChatState> {
  constructor(props: IChatProps & IChatConnState & IChatConnActions) {
    super(props);
    this.state = { content: "" };
  }

  public componentDidMount(): void {
    this.readChat();
  }

  public componentDidUpdate(): void {
    this.readChat();
  }

  public readChat(): void {
    const { chat } = this.props;
    if (chat && chat.unread) {
      this.props.readChat();
    }
  }

  public render(): ReactNode {
    const { chat, messages, logoutUser: logout, unread } = this.props;
    if (!chat) {
      return <h3>Loading...</h3>;
    }

    const { content } = this.state;
    return (
      <div>
        <div className="header">
          <Link className="header-button" to="/chats">
            &lt;&lt;
            {!!unread && <div className="unread">{unread}</div>}
          </Link>
          <h1 className="header-title">{chat.name}</h1>
          <a className="header-button" onClick={logout}>
            Logout
          </a>
        </div>
        <div className="messages">
          {messages.map((message, index) => (
            <div
              className={`message ${message.from ? "message-not-me" : "message-me"}`}
              key={index}
            >
              <div className="bubble">
                {message.from && <div className="message-from">{message.from}</div>}
                <div className="message-content">{message.content}</div>
              </div>
            </div>
          ))}
        </div>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          <input onChange={this.handleContentChange} value={content} />
          <button>Send</button>
        </form>
      </div>
    );
  }

  private readonly handleContentChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ content: event.currentTarget.value });
  };

  private readonly handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { content } = this.state;
    this.props.sendMessage(content);
    this.setState({ content: "" });
  };
}

const mapStateToProps = (state: IState, { chatId }: IChatProps): IChatConnState => ({
  chat: getChat(state, chatId),
  messages: getMessages(state, chatId),
  unread: getUnread(state),
});

const mapDispatchToProps = (
  dispatch: AppThunkDispatch,
  { chatId }: IChatProps,
): IChatConnActions => ({
  logoutUser: () => {
    dispatch(logoutUser());
  },
  readChat: () => {
    dispatch(readChat(chatId));
  },
  sendMessage: (content: string) => {
    dispatch(sendMessage(chatId, content));
  },
});

export default connect<IChatConnState, IChatConnActions, IChatProps, IState>(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
