// utils/db_orm.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('employees', 'root', 'onepiece9960', {
  host: 'localhost',
  dialect: 'mysql', // ou 'sqlite', etc.
});

export default sequelize;
