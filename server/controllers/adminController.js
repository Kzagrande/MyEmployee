// controllers/adminController.js
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import fastcsv from "fast-csv";


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
        rg,
        bu,
        shift,
        schedule_time,
        company,
        status,
        hire_date,
        date_of_birth,
        ethnicity,
        gender,
        neighborhood,
        city,
        email,
        phone,
        integration_date,
      } = req.body;

      const insertQuery = `
      INSERT INTO employees.employee_register (
        employee_id, cpf, name,rg, role_, bu, shift, schedule_time, company, status, 
        hire_date, date_of_birth, ethnicity, gender, 
        neighborhood, city, email, phone, integration_date
      )
      VALUES ?`;

      const values = [
        [
          employee_id,
          cpf,
          name,
          rg,
          role_,
          bu,
          shift,
          schedule_time,
          company,
          status,
          hire_date,
          date_of_birth,
          ethnicity,
          gender,
          neighborhood,
          city,
          email,
          phone,
          integration_date,
        ],
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

  async updateEmployee(req, res) {
    try {
      const {
        employee_id,
        cpf,
        name,
        role_,
        rg,
        bu,
        shift,
        schedule_time,
        company,
        status,
        hire_date,
        date_of_birth,
        ethnicity,
        gender,
        neighborhood,
        city,
        email,
        phone,
        integration_date,
      } = req.body;

      const updateQuery = `
        UPDATE employees.employee_register 
        SET
          cpf = ?,
          name = ?,
          rg = ?,
          role_ = ?,
          bu = ?,
          shift = ?,
          schedule_time = ?,
          company = ?,
          status = ?,
          hire_date = ?,
          date_of_birth = ?,
          ethnicity = ?,
          gender = ?,
          neighborhood = ?,
          city = ?,
          email = ?,
          phone = ?,
          integration_date = ?
        WHERE
          employee_id = ?`;

      const values = [
        cpf,
        name,
        rg,
        role_,
        bu,
        shift,
        schedule_time,
        company,
        status,
        hire_date,
        date_of_birth,
        ethnicity,
        gender,
        neighborhood,
        city,
        email,
        phone,
        integration_date,
        employee_id,
      ];

      try {
        await new Promise((resolve, reject) => {
          con.query(updateQuery, values, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      } catch (error) {
        console.error("Erro durante a atualização dos registros:", error);
        throw error;
      }

      // A atualização foi bem-sucedida
      return res
        .status(200)
        .json({ Status: true, Message: "Employee updated successfully." });
    } catch (err) {
      console.error("Error during updateEmployee:", err.message);
      return res.status(500).json({ Status: false, Error: err.message });
    }
  }

  listEmployee = (req, res) => {
    const query = "SELECT * FROM employees.activities_hc";

    con.query(query, (error, results) => {
      if (error) {
        console.error("Erro ao executar a consulta SQL:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      } else {
        res.status(200).json(results);
      }
    });
  };

  async exportActivitiesHc(req, res) {
    try {
      const data = await this.executeQuery(
        `SELECT * FROM activities_hc
        `
      );
      const jsonData = JSON.parse(JSON.stringify(data));

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=agency_data.csv"
      );
      res.setHeader("Content-Type", "text/csv");

      // Criar um stream de escrita no response
      fastcsv
        .write(jsonData, { headers: true })
        .on("finish", () => {
          console.log("Enviado com sucesso para o usuário!");
        })
        .pipe(res); // Pipe para o response diretamente
      // console.log(res);
    } catch (err) {
      console.error("Erro:", err);
      return res
        .status(500)
        .json({ error: "Erro ao exportar dados da agência" });
    }
  }

  executeQuery(query) {
    return new Promise((resolve, reject) => {
      con.query(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  logout(req, res) {
    res.clearCookie("token");
    return res.json({ Status: true });
  }
}

export default new AdminController();
