// controllers/adminController.js
import con from "../utils/db.js";
import jwt from "jsonwebtoken";

class AdminController {
  login(req, res) {
    const sql =
      "SELECT * from employees.users_sys Where id_employee = ? and password_ = ? and status = 0";
    con.query(sql, [req.body.id_employee, req.body.password], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        const id_employee = result[0].id_employee;
        const token = jwt.sign(
          { role: "planning", id_employee: id_employee, id: result[0].id },
          "jwt_secret_key",
          { expiresIn: "1d" }
        );
        res.cookie("token", token);
        return res.json({ loginStatus: true });
      } else {
        return res.json({
          loginStatus: false,
          Error: "wrong id_employee or password",
        });
      }
    });
  }

  async addEmployee(req, res) {
    try {
      const {
        employee_id,
        cpf,
        name,
        role_,
        bu,
        shift,
        schedule_time,
        company,
        status,
        hire_date,
        date_of_birth,
        termination_date,
        reason,
        ethnicity,
        gender,
        neighborhood,
        city,
        email,
        phone,
        presence_integration,
        integration_date,
      } = req.body;

      const insertQuery = `
      INSERT INTO employees.employee_register (
        employee_id, cpf, name, role_, bu, shift, schedule_time, company, status, 
        hire_date, date_of_birth, termination_date, reason, ethnicity, gender, 
        neighborhood, city, email, phone, presence_integration, integration_date
      )
      VALUES ?`;

      const values = [
        [
          employee_id,
          cpf,
          name,
          role_,
          bu,
          shift,
          schedule_time,
          company,
          status,
          hire_date,
          date_of_birth,
          termination_date,
          reason,
          ethnicity,
          gender,
          neighborhood,
          city,
          email,
          phone,
          presence_integration,
          integration_date
        ]
      ];
      

    try {
      await new Promise((resolve, reject) => {
        con.query(insertQuery, [values], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Erro durante a inserção dos registros:", error);
      throw error;
    }
    } catch (err) {
      console.error("Error during addEmployee:", err.message);
      return res.status(500).json({ Status: false, Error: err.message });
    }
  }


  listEmployee = (req, res) => {
    const query = 'SELECT * FROM employees.employee_register WHERE presence_integration IS NULL';

    con.query(query, (error, results) => {
      if (error) {
        console.error('Erro ao executar a consulta SQL:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      } else {

        res.status(200).json(results);
      }
    });
  };



  logout(req, res) {
    res.clearCookie("token");
    return res.json({ Status: true });
  }
}

export default new AdminController();
