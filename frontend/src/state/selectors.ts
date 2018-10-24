import { IState } from "./state";

export function getToken(state: IState): string | null {
  const { token } = state;
  return token;
}

export function getTokenOrThrow(state: IState): string {
  const token = getToken(state);
  if (!token) {
    throw new Error("unauthorized");
  }
  return token;
}
