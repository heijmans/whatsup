import React, { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { connect } from "react-redux";
import { AppThunkDispatch } from "../state/actions";
import { IState } from "../state/state";
import { registerUser } from "../state/user.actions";

interface IRegisterState {
  username: string;
  password: string;
}

interface IRegisterConnActions {
  registerUser: (username: string, password: string) => void;
}

export class Register extends Component<IRegisterConnActions, IRegisterState> {
  constructor(props: IRegisterConnActions) {
    super(props);
    this.state = { username: "", password: "" };
  }

  public render(): ReactNode {
    const { username, password } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Register</h1>
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
          <button>Register</button>
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
    this.props.registerUser(username, password);
  };
}

const mapDispatchToProps = (dispath: AppThunkDispatch): IRegisterConnActions => ({
  registerUser: (username, password) => {
    dispath(registerUser(username, password));
  },
});

export default connect<{}, IRegisterConnActions, {}, IState>(
  null,
  mapDispatchToProps,
)(Register);
