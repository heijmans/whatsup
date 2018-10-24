import bcrypt from "bcrypt";
import { Table, Column, Model, BeforeCreate } from "sequelize-typescript";

@Table({ tableName: "users", timestamps: true })
export default class User extends Model<User> {
  @Column({ allowNull: false, unique: true })
  username!: string;

  @Column({ allowNull: false })
  password!: string;

  @BeforeCreate
  static encryptPassword(user: User) {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
  }

  validatePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }

  static async login(username: string, password: string): Promise<User | undefined> {
    const user = await User.findOne({ where: { username } });
    return user && user.validatePassword(password) ? user : undefined;
  }
}
