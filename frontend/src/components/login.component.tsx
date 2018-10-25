import React, { ChangeEvent, Component, FormEvent, ReactNode } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
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
      <div>
        <div className="header">
          <div className="header-item" />
          <h1 className="header-title">Login</h1>
          <Link className="header-button" to="/user/register">
            Register
          </Link>
        </div>
        <div className="body">
          <form onSubmit={this.handleSubmit}>
            <div className="form-control">
              <label htmlFor="username">Username: </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={this.handleUsernameChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password: </label>
              <input
                id="username"
                type="password"
                value={password}
                onChange={this.handlePasswordChange}
              />
            </div>
            <div className="form-control">
              <button>Login</button>
            </div>
          </form>
        </div>
      </div>
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
