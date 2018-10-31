import { Request } from "express";
import jwt from "jsonwebtoken";

export function getAuthorization<T>(req: Request, jwtSecret: string): T | undefined {
  const header = req.headers.authorization;
  if (!header || !header.match(/^Bearer \S+$/)) {
    return undefined;
  }
  const token = header.split(" ")[1];
  if (!token) {
    return undefined;
  }
  const result = jwt.verify(token, jwtSecret);
  if (!result) {
    return undefined;
  }
  return (result as any) as T;
}
