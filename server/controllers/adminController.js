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
      const sql = `
        INSERT INTO employees.employees_list
        (name, id_employee, admission_dt, company, warehouse, bz, collar, category, sector, role_1, shift, schedule, manager_1, manager_2, manager_3, status, role_2, user_)
        VALUES (?)
      `;

      const values = [
        req.body.name,
        req.body.id_employee,
        req.body.admission_dt,
        req.body.company,
        req.body.warehouse,
        req.body.bz,
        req.body.collar,
        req.body.category,
        req.body.sector,
        req.body.role_1,
        req.body.shift,
        req.body.schedule,
        req.body.manager_1,
        req.body.manager_2,
        req.body.manager_3,
        req.body.status,
        req.body.role_2,
        req.body.user_,
      ];

      await con.execute(sql, [values]);

      console.log("Employee data inserted successfully!");
      return res.json({ Status: true, values });
    } catch (err) {
      console.error("Error during addEmployee:", err.message);
      return res.status(500).json({ Status: false, Error: err.message });
    }
  }
 listEmployee = (req, res) => {
  const query = 'SELECT * FROM employees.agency_input_activies';

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
