import { Sequelize } from "sequelize-typescript";
import config from "../../config/config";

const env = process.env.NODE_ENV || "development";

export const sequelize = new Sequelize(
  Object.assign({}, (config as any)[env], {
    modelPaths: [__dirname + "/**/*.model.ts"],
  }),
);
