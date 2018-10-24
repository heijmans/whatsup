import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getChat, getMessages } from "../state/selectors";
import { IChat, IMessage, IState } from "../state/state";

interface IChatProps {
  chatId: number;
}

interface IChatConnState {
  chat: IChat | undefined;
  messages: IMessage[];
}

export function Chat({ chat, messages }: IChatProps & IChatConnState): ReactElement<HTMLElement> {
  if (!chat) {
    return <h3>Loading...</h3>;
  }

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
    </div>
  );
}

const mapStateToProps = (state: IState, { chatId }: IChatProps): IChatConnState => ({
  chat: getChat(state, chatId),
  messages: getMessages(state, chatId),
});

export default connect<IChatConnState, {}, IChatProps, IState>(mapStateToProps)(Chat);
