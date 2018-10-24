import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";
import { getToken } from "../state/selectors";
import { IState } from "../state/state";

interface IAppConnState {
  token: string | null;
}

interface IRouteParams {
  chatId?: string;
}

export function App({ token }: IAppConnState): ReactElement<HTMLDivElement> {
  if (!token) {
    return (
      <div>
        <div>
          <Link to="/user/login">Login</Link>
          <Link to="/user/register">Register</Link>
        </div>
        <Switch>
          <Route exact path="/user/login" render={() => <h1>Login</h1>} />
          <Route exact path="/user/register" render={() => <h1>Register</h1>} />
          <Redirect to="/user/login" />
        </Switch>
      </div>
    );
  } else {
    return (
      <Switch>
        <Route exact path="/chats" render={() => <h1>Chats</h1>} />
        <Route
          exact
          path="/chats/:chatId"
          render={({ match }: RouteComponentProps<IRouteParams>) => (
            <h1>Chat {parseInt(match.params.chatId!, 10)}</h1>
          )}
        />
        <Redirect to="/chats" />
      </Switch>
    );
  }
}

const mapStateToProps = (state: IState): IAppConnState => ({
  token: getToken(state),
});

export default connect(
  mapStateToProps,
  undefined,
  undefined,
  { pure: false },
)(App);
