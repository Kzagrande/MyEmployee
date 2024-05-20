// utils/db_orm.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();


  const sequelize = new Sequelize('employees', 'root', `${process.env.DB_PSW}`, {
  host: 'localhost',
  dialect: 'mysql', // ou 'sqlite', etc.
});

export default sequelize;
