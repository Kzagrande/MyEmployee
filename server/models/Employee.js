// models/Employee.js
import { DataTypes } from 'sequelize';
import sequelize from '../utils/db_orm.js';

const Employee = sequelize.define('Employee', {
  employee_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'company_infos', // Nome da tabela no banco de dados
  timestamps: false, // Se você não quiser createdAt e updatedAt
});

export default Employee;
