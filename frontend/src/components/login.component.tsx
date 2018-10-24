import React, { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { connect } from "react-redux";
import { AppThunkDispatch } from "../state/actions";
import { IState } from "../state/state";
import { loginUser } from "../state/user.actions";

interface ILoginState {
  username: string;
  password: string;
}

interface ILoginConnActions {
  loginUser: (username: string, password: string) => void;
}

export class Login extends Component<ILoginConnActions, ILoginState> {
  constructor(props: ILoginConnActions) {
    super(props);
    this.state = { username: "", password: "" };
  }

  public render(): ReactNode {
    const { username, password } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Login</h1>
        <p>
          <label htmlFor="username">Username: </label>
          <input id="username" type="text" value={username} onChange={this.handleUsernameChange} />
        </p>
        <p>
          <label htmlFor="password">Password: </label>
          <input
            id="username"
            type="password"
            value={password}
            onChange={this.handlePasswordChange}
          />
        </p>
        <p>
          <button>Login</button>
        </p>
      </form>
    );
  }

  private readonly handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.currentTarget.value });
  };

  private readonly handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.currentTarget.value });
  };

  private readonly handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { username, password } = this.state;
    this.props.loginUser(username, password);
  };
}

const mapDispatchToProps = (dispath: AppThunkDispatch): ILoginConnActions => ({
  loginUser: (username, password) => {
    dispath(loginUser(username, password));
  },
});

export default connect<{}, ILoginConnActions, {}, IState>(
  null,
  mapDispatchToProps,
)(Login);
