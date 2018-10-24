import { IUser } from "./state";

function jwtHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function jsonBody() {
  return {
    "Content-Type": "application/json",
  };
}

const userService = {
  async get(token: string): Promise<IUser> {
    const response = await fetch("/api/user", { headers: jwtHeaders(token) });
    const user = await response.json();
    return user;
  },

  async register(username: string, password: string): Promise<IUser> {
    const response = await fetch("/api/user/register", {
      body: JSON.stringify({ username, password }),
      headers: jsonBody(),
      method: "POST",
    });
    const user = await response.json();
    return user;
  },

  async login(username: string, password: string): Promise<string> {
    const response = await fetch("/api/user/login", {
      body: JSON.stringify({ username, password }),
      headers: jsonBody(),
      method: "POST",
    });
    const data = await response.json();
    return data.token;
  },
};

export default userService;
