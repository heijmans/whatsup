import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { getToken } from "../state/selectors";
import { IState } from "../state/state";
import Chat from "./chat.component";
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
      <div className="app">
        <Switch>
          <Route exact path="/user/login" component={Login} />
          <Route exact path="/user/register" component={Register} />
          <Redirect to="/user/login" />
        </Switch>
      </div>
    );
  } else {
    return (
      <div className="app">
        <Switch>
          <Route exact path="/chats" component={Chats} />
          <Route
            exact
            path="/chats/:chatId"
            render={({ match }: RouteComponentProps<IRouteParams>) => (
              <Chat chatId={parseInt(match.params.chatId!, 10)} />
            )}
          />
          <Redirect to="/chats" />
        </Switch>
      </div>
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
