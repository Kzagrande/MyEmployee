// controllers/adminController.js
import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
import fastcsv from "fast-csv";
import moment from "moment";
import verifyUser from "../middleware/verifyUser.js";
import dissmissalModel from "../models/adminModel.js";

class AdminController {
  login(req, res) {
    const sql =
      "SELECT * from employees.users_sys Where id_employee = ? and password_ = ? and status = 0";
    pool.query(
      sql,
      [req.body.id_employee, req.body.password],
      (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
          const id_employee = result[0].id_employee;
          const token = jwt.sign(
            { role: "admin", id_employee: id_employee, id: result[0].id },
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
      }
    );
  }

  async addEmployee(req, res) {
    try {
      const {
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
      } = req.body;

      // const formatDate = (dateString) => {
      //   return moment(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD');
      // };

      const formattedHireDate = this.formatDate(hire_date);
      const formattedDateOfBirth = this.formatDate(date_of_birth);
      const formattedIntegrationDate = this.formatDate(integration_date);

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
          formattedHireDate,
          formattedDateOfBirth,
          ethnicity,
          gender,
          neighborhood,
          city,
          email,
          phone,
          formattedIntegrationDate,
        ],
      ];

      try {
        await new Promise((resolve, reject) => {
          pool.query(insertQuery, [values], (err, result) => {
            if (err) {
              console.error("Erro durante a execução da query:", err);
              reject(err);
            } else {
              console.log("Inserção bem-sucedida:", result);
              resolve();
            }
          });
        });
      } catch (error) {
        console.error("Erro durante a inserção dos registros:", error);
        throw error;
      }

      return res
        .status(200)
        .json({ Status: true, Message: "Registros inseridos com sucesso" });
    } catch (err) {
      console.error("Erro durante addEmployee:", err.message);
      return res.status(500).json({ Status: false, Error: err.message });
    }
  }

  validateInput(data) {
    if (!data || data.length === 0) {
      throw new Error("Arquivo CSV vazio ou ausente.");
    }
  }

  async updateDismissalGroup(req, res) {
    const dadosCSV = req.body.csvFile;
    this.validateInput(dadosCSV);

    try {
      dadosCSV.shift();
      dadosCSV.pop();

      const DModel = dadosCSV.map(
        (registro) =>
          new dissmissalModel({
            employee_id: registro[0],
            employee_name: registro[1],
            dismissal_date: this.formatDate(registro[2]),
            termination_type: registro[3],
            reason: registro[4],
            comunication_date: registro[5],
          })
      );

      const insertQuery = `
        INSERT INTO employees.dismissal_employees (
          employee_id, employee_name, dismissal_date, termination_type, reason,comunication_date
        ) VALUES ?`;

      const updateStatusQuery = `
        UPDATE employees.company_infos 
        SET
        status = 'FIRED'
        WHERE
          employee_id IN (?)`;

      // Use Promise.all to execute both insert and update queries concurrently
      await Promise.all([
        this.insertRecords(DModel, insertQuery),
        this.updateStatus(DModel, updateStatusQuery),
      ]);

      res.send("Registros inseridos com sucesso");
    } catch (err) {
      console.error("Erro durante o processamento do CSV:", err);
      res.status(500).send(err.message);
    }
  }


  async updateStatus(DModel, updateStatusQuery) {
    // Extract employee_ids from DModel
    const employeeIds = DModel.map((data) => data.employee_id);
    console.log("employee", employeeIds);

    try {
      await new Promise((resolve, reject) => {
        pool.query(updateStatusQuery, [employeeIds], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Erro durante a atualização do status:", error);
      throw error;
    }
  }

  async insertRecords(dismissalModels, query) {
    const values = dismissalModels.map((data) => Object.values(data));
    try {
      await new Promise((resolve, reject) => {
        pool.query(query, [values], (err, result) => {
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
  }

  
  formatDate(dateString) {
    return moment(dateString, "DD/MM/YYYY").format("YYYY-MM-DD");
  }

  async updateEmployee(req, res) {
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
        hire_date,
        date_of_birth,
        ethnicity,
        gender,
        neighborhood,
        city,
        email,
        phone,
        integration_date
      } = req.body;

      const updateQuery = `
      UPDATE employees.employee_register 
      SET
        cpf = ?,
        name = ?,
        role_ = ?,
        bu = ?,
        shift = ?,
        schedule_time = ?,
        company = ?,
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
        role_,
        bu,
        shift,
        schedule_time,
        company,
        this.formatDate(hire_date),
       this.formatDate(date_of_birth),
        ethnicity,
        gender,
        neighborhood,
        city,
        email,
        phone,
        this.formatDate(integration_date),
        employee_id,
      ];

      try {
        await new Promise((resolve, reject) => {
          pool.query(updateQuery, values, (err, result) => {
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
        .json({ Status: true, Message: "Informações alteradas com sucesso!" });
    } catch (err) {
      console.error("Error during updateEmployee:", err.message);
      return res.status(500).json({ Status: false, Error: err.message });
    }
  }

  listEmployee = (req, res) => {
    // Call the verifyUser middleware before processing the request
    verifyUser(req, res, () => {
      // If the verification is successful, proceed with the database query
      const query = "SELECT * FROM employees.active_hc";

      pool.query(query, (error, results) => {
        if (error) {
          console.error("Erro ao executar a consulta SQL:", error);
          res.status(500).json({ error: "Erro interno do servidor" });
        } else {
          const modifiedResults = results.map((employee) => {
            return {
              ...employee,
              hire_date: moment(employee.hire_date).format("DD/MM/YYYY"),
              integration_date: moment(employee.integration_date).format(
                "DD/MM/YYYY"
              ),
              date_of_birth: moment(employee.date_of_birth).format(
                "DD/MM/YYYY"
              ),
            };
          });

          // console.log('modifiedResults', modifiedResults);
          res.status(200).json(modifiedResults);
        }
      });
    });
  };

  async exportActiveHc(req, res) {
    console.log("chamei o export");
    try {
      const data = await this.executeQuery(`SELECT * FROM active_hc`);

      if (data.length === 0) {
        return res
          .status(404)
          .json({ error: "Nenhum dado encontrado para exportar." });
      }

      // Formatar as datas antes de escrever no CSV usando moment
      const formattedData = data.map((row) => {
        const formattedRow = { ...row };
        formattedRow.date_of_birth = moment(row.date_of_birth).format(
          "YYYY-MM-DD"
        );
        formattedRow.hire_date = moment(row.hire_date).format("YYYY-MM-DD");
        formattedRow.integration_date = moment(row.integration_date).format(
          "YYYY-MM-DD"
        );
        return formattedRow;
      });

      // Pega as chaves da primeira linha para usar como cabeçalhos
      const headers = Object.keys(formattedData[0]);

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=agency_data.csv"
      );
      res.setHeader("Content-Type", "text/csv");

      // Crie um stream de escrita no response
      fastcsv
        .write(formattedData, {
          headers,
          includeEndRowDelimiter: true,
          delimiter: ";",
        })
        .on("finish", () => {
          console.log("Enviado com sucesso para o usuário!");
        })
        .pipe(res); // Pipe para o response diretamente
    } catch (err) {
      console.error("Erro:", err);
      return res
        .status(500)
        .json({ error: "Erro ao exportar dados da agência" });
    }
  }

  executeQuery(query) {
    return new Promise((resolve, reject) => {
      pool.query(query, (err, data) => {
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
