import { createBrowserHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import App from "./components/App";
import "./index.scss";
import reducers from "./state/reducers";

const history = createBrowserHistory();
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root"),
);
