function jwtHeaders(token: string): { [key: string]: string } {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function jsonBody(): { [key: string]: string } {
  return {
    "Content-Type": "application/json",
  };
}

function checkResponse(response: Response): void {
  if (response.status >= 300) {
    throw new Error(`error: ${response.status}`);
  }
}
