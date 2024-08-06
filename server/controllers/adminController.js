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
      "SELECT * FROM employees.users_sys WHERE employee_id = ? AND password_ = ? AND status_ BETWEEN 0 AND 4;";

    pool.query(
      sql,
      [req.body.id_employee, req.body.password],
      (err, result) => {
        // console.log('result',req.body)
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
          const employee_id = result[0].employee_id;
          const user_name = result[0].name;
          const token = jwt.sign(
            {
              role: "admin",
              employee_id: employee_id,
              user_name: user_name,
              id: result[0].id,
            },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({ loginStatus: true, token, result });
        } else {
          return res.json({
            loginStatus: false,
            Error: "wrong employee_id or password",
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
      } = req.body.data;

      // const formatDate = (dateString) => {
      //   return moment(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD');
      // };

      const formattedHireDate = this.formatDate(hire_date);
      const formattedDateOfBirth = this.formatDate(date_of_birth);
      const formattedIntegrationDate = this.formatDate(integration_date);

      const insertQuery = `
        INSERT INTO employees.employee_register (
          employee_id, cpf, name, role_, bu, shift, schedule_time, company, status, 
          hire_date, date_of_birth, ethnicity, gender, 
          neighborhood, city, email, phone, integration_date
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
            requester_id : registro[0],
            requester_name : registro[1],
            employee_id : registro[2],
            employee_name : registro[3],
            termination_type : registro[4],
            reason : registro[5],
            observation : registro[6],
            fit_for_hiring : registro[7],
            fit_for_hiring_reason : registro[8],
            dismissal_date : this.formatDate(registro[9]),
            communication_date: registro[10],
          })
      );

      const insertQuery = `
        INSERT INTO employees.dismissal_employees (
          requester_id,requester_name,employee_id,employee_name,termination_type,reason,observation,fit_for_hiring,fit_for_hiring_reason,dismissal_date,communication_date
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

  async updateDismissalEmployee(req, res) {
    try {
      const { employee_register, company_infos, dismissal_infos } =
        req.body.data;

      const update_register_query = `
      UPDATE employees.employee_register 
      SET
        cpf = ?,
        name = ?,
        role_ = ?,
        bu = ?,
        status = ?,
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

      const update_company_query = `
      UPDATE employees.company_infos 
      SET
      sector=?
      WHERE
        employee_id = ?`;

      const update_dismissal_query = `
      UPDATE employees.dismissal_employees
      SET
      dismissal_date =?,
      termination_type = ?,
      reason = ?,
      communication_date = ?
      WHERE
        employee_id = ?`;

      const register_values = [
        employee_register.cpf,
        employee_register.name,
        employee_register.role_,
        employee_register.bu,
        employee_register.status,
        employee_register.shift,
        employee_register.schedule_time,
        employee_register.company,
        this.formatDate(employee_register.hire_date),
        this.formatDate(employee_register.date_of_birth),
        employee_register.ethnicity,
        employee_register.gender,
        employee_register.neighborhood,
        employee_register.city,
        employee_register.email,
        employee_register.phone,
        this.formatDate(employee_register.integration_date),
        employee_register.employee_id,
      ];

      const company_values = [company_infos.sector, company_infos.employee_id];

      const dismissal_values = [
        this.formatDate(dismissal_infos.dismissal_date),
        dismissal_infos.termination_type,
        dismissal_infos.reason,
        this.formatDate(dismissal_infos.communication_date),
        dismissal_infos.employee_id,
      ];

      await this.executeQueryParams(update_register_query, register_values);
      await this.executeQueryParams(update_company_query, company_values);
      await this.executeQueryParams(update_dismissal_query, dismissal_values);

      this.editsLog(req.body.oldData, req.body.newData, req.body.ids);

      return res
        .status(200)
        .json({ Status: true, Message: "Registros inseridos com sucesso" });
    } catch (err) {
      console.error("Erro durante addEmployee:", err.message);
      return res.status(500).json({ Status: false, Error: err.message });
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
    // console.log('req',req.body)
    try {
      const {
        employee_id,
        cpf,
        name,
        role_,
        bu,
        status,
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
        integration_date,
      } = req.body.data;

      const updateQuery = `
      UPDATE employees.employee_register 
      SET
        cpf = ?,
        name = ?,
        role_ = ?,
        bu = ?,
        status = ?,
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
        status,
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
      this.editsLog(req.body.oldData, req.body.newData, req.body.ids);

      return res
        .status(200)
        .json({ Status: true, Message: "Informações alteradas com sucesso!" });
    } catch (err) {
      console.error("Error during updateEmployee:", err.message);
      return res.status(500).json({ Status: false, Error: err.message });
    }
  }

  async editsLog(oldData, newData, ids) {
    const editedFields = Object.keys(newData);
    try {
      for (const field of editedFields) {
        // Montar o objeto de dados para inserção na tabela edit_history
        const logData = {
          editor_id: ids.editor_id,
          employee_id: ids.employee_id,
          edited_field: field,
          old_value: oldData[field],
          new_value: newData[field],
        };
        pool.query("INSERT INTO edit_history SET ?", logData);
      }
      console.log("Registros de edição inseridos com sucesso.");
    } catch (error) {
      console.error("Erro ao inserir registros de edição:", error);
    }
  }

  async registerUser(req, res) {
    try {
      const new_user = req.body;

      // Insira o novo usuário no banco de dados
      await pool
        .promise()
        .query("INSERT INTO employees.users_sys SET ?", new_user);

      console.log("Novo usuário adicionado:", new_user);
      res.status(201).send("Usuário registrado com sucesso.");
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error);
      res.status(500).send("Erro ao registrar o usuário.");
    }
  }

  async fireEmployee(req, res) {
    try {
      const {
        requester_id,
        requester_name,
        employee_id,
        employee_name,
        termination_type,
        reason,
        observation,
        fit_for_hiring,
        fit_for_hiring_reason,
        dismissal_date,
      } = req.body;

      const formattedDismissalDate = this.formatDate(dismissal_date);
      const communicationDate = moment().format("YYYY-MM-DD");

      const insertQuery = `
        INSERT INTO employees.dismissal_employees (
          requester_id, requester_name, employee_id, employee_name, termination_type, reason, observation, fit_for_hiring, fit_for_hiring_reason, dismissal_date,communication_date
        )
        VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?)`;

      const updateQuery = `
        UPDATE employees.employee_register
        SET status = 'FIRED'
        WHERE employee_id = ?`;

      const insertResult = await this.executeQueryParams(insertQuery, [
        requester_id,
        requester_name,
        employee_id,
        employee_name,
        termination_type,
        reason,
        observation,
        fit_for_hiring,
        fit_for_hiring_reason,
        formattedDismissalDate,
        communicationDate,
      ]);

      const updateResult = await this.executeQueryParams(updateQuery, [
        employee_id,
      ]);

      console.log("Registros inseridos com sucesso:", insertResult);
      console.log(
        "Registro de funcionário atualizado com sucesso:",
        updateResult
      );

      return res
        .status(200)
        .json({ Status: true, Message: "Registros inseridos com sucesso" });
    } catch (error) {
      console.error("Erro durante fireEmployee:", error.message);
      return res.status(500).json({ Status: false, Error: error.message });
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

  dismissalEmployeeList = (req, res) => {
    // Call the verifyUser middleware before processing the request
    verifyUser(req, res, () => {
      // If the verification is successful, proceed with the database query
      const query = "SELECT * FROM employees.dismissal_hc";

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
              dismissal_date: moment(employee.dismissal_date).format(
                "DD/MM/YYYY"
              ),
              communication_date: moment(employee.communication_date).format(
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
  async exportDismissaHc(req, res) {
    console.log("chamei o export");
    try {
      const data = await this.executeQuery(`SELECT * FROM dismissal_hc`);

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

  executeQueryParams(query, values) {
    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, result) => {
        if (error) {
          console.error("Erro durante a execução da query:", error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  raisePromotions(req, res) {
    console.log(req.body);
  }

  logout(req, res) {
    res.clearCookie("token");
    return res.json({ Status: true });
  }
}

export default new AdminController();
