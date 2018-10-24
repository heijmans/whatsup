import React, { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AppThunkDispatch } from "../state/actions";
import { sendMessage } from "../state/chat.actions";
import { getChat, getMessages } from "../state/selectors";
import { IChat, IMessage, IState } from "../state/state";

interface IChatProps {
  chatId: number;
}

interface IChatConnState {
  chat: IChat | undefined;
  messages: IMessage[];
}

interface IChatConnActions {
  sendMessage: (content: string) => void;
}

interface IChatState {
  content: string;
}

export class Chat extends Component<IChatProps & IChatConnState & IChatConnActions, IChatState> {
  constructor(props: IChatProps & IChatConnState & IChatConnActions) {
    super(props);
    this.state = { content: "" };
  }

  public render(): ReactNode {
    const { chat, messages } = this.props;
    if (!chat) {
      return <h3>Loading...</h3>;
    }

    const { content } = this.state;
    return (
      <div>
        <Link to="/chats">&lt;&lt; Back</Link>
        <h1>{chat.name}</h1>
        <ul>
          {messages.map((message) => (
            <li key={message.uuid}>
              from: {message.from || "you"}
              <br />
              {message.content}
            </li>
          ))}
        </ul>
        <form onSubmit={this.handleSubmit}>
          <p>
            <input onChange={this.handleContentChange} value={content} />
            <button>Send</button>
          </p>
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
});

const mapDispatchToProps = (
  dispatch: AppThunkDispatch,
  { chatId }: IChatProps,
): IChatConnActions => ({
  sendMessage: (content: string) => {
    dispatch(sendMessage(chatId, content));
  },
});

export default connect<IChatConnState, IChatConnActions, IChatProps, IState>(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
