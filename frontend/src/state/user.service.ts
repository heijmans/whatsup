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

function checkResponse(response: Response) {
  if (response.status >= 300) {
    throw new Error(`error: ${response.status}`);
  }
}

const userService = {
  async get(token: string): Promise<IUser> {
    const response = await fetch("/api/user", { headers: jwtHeaders(token) });
    checkResponse(response);
    const user = await response.json();
    return user;
  },

  async register(username: string, password: string): Promise<IUser> {
    const response = await fetch("/api/user/register", {
      body: JSON.stringify({ username, password }),
      headers: jsonBody(),
      method: "POST",
    });
    checkResponse(response);
    const user = await response.json();
    return user;
  },

  async login(username: string, password: string): Promise<string> {
    const response = await fetch("/api/user/login", {
      body: JSON.stringify({ username, password }),
      headers: jsonBody(),
      method: "POST",
    });
    checkResponse(response);
    const data = await response.json();
    return data.token;
  },
};

export default userService;
