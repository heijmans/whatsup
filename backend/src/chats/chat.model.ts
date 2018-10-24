import { Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: "chats", timestamps: true })
export default class Chat extends Model<Chat> {
  @Column({ allowNull: false, unique: true })
  public name!: string;
}
