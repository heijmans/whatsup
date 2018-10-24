import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

export type SimpleThunkAction<State, Result = void, A extends Action = Action> = ThunkAction<
  Result,
  State,
  undefined,
  A
>;

export type SimpleThunkDispatch<State, A extends Action = Action> = ThunkDispatch<
  State,
  undefined,
  A
>;
