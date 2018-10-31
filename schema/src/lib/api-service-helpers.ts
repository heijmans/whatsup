export function jwtHeaders(token: string): { [key: string]: string } {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function jsonBodyHeaders(): { [key: string]: string } {
  return {
    "Content-Type": "application/json",
  };
}

export function checkResponse(response: Response): void {
  if (response.status >= 300) {
    throw new Error(`error: ${response.status}`);
  }
}
