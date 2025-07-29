import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user.model";
import { Role } from "../models/roles.model";
import { Task } from "../models/task.model";

import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  models: [User, Role, Task],
  logging: false,
});

export default sequelize;
