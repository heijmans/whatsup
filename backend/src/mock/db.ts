import loki, { Collection } from "lokijs";

// TODO: fix insert in loki typing, should return E & LokiObj
export function create<E extends object>(collection: Collection<E>, data: E): E & LokiObj {
  const result = collection.insert(data);
  if (!result) {
    throw new Error("could not create record");
  }
  return result as (E & LokiObj);
}

export const db = new loki("database");

// chat

export interface IChatFields {
  name: string;
}
export type Chat = IChatFields & LokiObj;

export const chats = db.addCollection<IChatFields>("chats");
chats.insert([
  { name: "react" },
  { name: "angular" },
  { name: "vue" },
]);

// user

export interface IUserFields {
  username: string;
  password: string;
}
export type User = IUserFields & LokiObj;

export const users = db.addCollection<IUserFields>("users");
users.insert([
  { username: "jan", password: "test" },
  { username: "kees", password: "test" },
]);
