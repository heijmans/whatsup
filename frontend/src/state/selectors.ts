import { IState } from "./state";

export function getTokenOrThrow(state: IState): string {
  const { token } = state;
  if (!token) {
    throw new Error("unauthorized");
  }
  return token;
}
