import bcrypt from "bcrypt";
import { BeforeCreate, Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: "users", timestamps: true })
export default class User extends Model<User> {
  @BeforeCreate
  public static encryptPassword(user: User) {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
  }

  public static async login(username: string, password: string): Promise<User | undefined> {
    const user = await User.findOne({ where: { username } });
    return user && user.validatePassword(password) ? user : undefined;
  }

  @Column({ allowNull: false, unique: true })
  public username!: string;

  @Column({ allowNull: false })
  public password!: string;

  public validatePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
