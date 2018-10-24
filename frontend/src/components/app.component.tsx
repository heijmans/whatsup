import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";
import { getToken } from "../state/selectors";
import { IState } from "../state/state";
import Chats from "./chats.component";
import Login from "./login.component";
import Register from "./register.component";

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
          <Route exact path="/user/login" component={Login} />
          <Route exact path="/user/register" component={Register} />
          <Redirect to="/user/login" />
        </Switch>
      </div>
    );
  } else {
    return (
      <Switch>
        <Route exact path="/chats" component={Chats} />
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
