// controllers/planningController.js
import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
import PlanningModel from "../models/planningModel.js";
import fastcsv from "fast-csv";
import sgMail from "@sendgrid/mail";
import moment from "moment";

class PlanningController {
  login(req, res) {
    const sql =
      "SELECT * FROM employees.users_sys WHERE id_employee = ? AND password_ = ? AND status = 1";
    pool.query(
      sql,
      [req.body.id_employee, req.body.password],
      (err, result) => {
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
      }
    );
  }

  async uplaodPdInfos(req, res) {
    const dadosCSV = req.body.csvFile;
    this.dbTable = req.body.dbTable;
    this.validateInput(dadosCSV);

    try {
      dadosCSV.shift();
      dadosCSV.pop();
      const PlanningModels = dadosCSV.map(
        (registro) =>
          new PlanningModel({
            name: registro[0],
            employee_id: registro[1],
            activity_p: registro[2],
            area: registro[3],
            sector: registro[4],
            shift: registro[5],
            work_schedule: registro[6],
            type_: registro[7],
            status: registro[8],
            manager_1: registro[10],
            manager_2: registro[11],
            manager_3: registro[12],
            added_on_call: registro[13],
          })
      );

      await this.insertRecords(this.dbTable, PlanningModels);
      res.send("Registros inseridos com sucesso");
    } catch (err) {
      console.error("Erro durante o processamento do CSV:", err);
      res.status(500).send(err.message);
    }
  }

  validateInput(data) {
    if (!data || data.length === 0) {
      throw new Error("Arquivo CSV vazio ou ausente.");
    }
  }
  async insertRecords(table, PlanningModels) {
    try {
      for (const PlanningModel of PlanningModels) {
        const {
          employee_id,
          activity_p,
          area,
          sector,
          shift,
          work_schedule,
          type_,
          status,
          manager_1,
          manager_2,
          manager_3,
          added_on_call,
        } = PlanningModel;

        const updateQuery = `
          UPDATE employees.${table}
          SET activity_p = ?, area = ?, sector = ?, shift = ?,  work_schedule = ?, 
              type_ = ?, status = ?, manager_1 = ?, manager_2 = ?, manager_3 = ?, added_on_call = ?
          WHERE employee_id = ?`;

        const values = [
          activity_p,
          area,
          sector,
          shift,
          work_schedule,
          type_,
          status,
          manager_1,
          manager_2,
          manager_3,
          added_on_call,
          employee_id,
        ];

        await new Promise((resolve, reject) => {
          pool.query(updateQuery, values, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
      // Integração com a API do Slack após o sucesso da atualização
      // slack.client.chat.postMessage({
      //   token: process.env.SLACK_BOT_TOKEN,
      //   channel: process.env.SLACK_CHANNEL,
      //   text: `Os registros foram atualizados com sucesso na tabela ${table}.`,
      // });
      // console.log("Mensagem enviada para o Slack com sucesso.");
    } catch (error) {
      console.error("Erro durante a atualização dos registros:", error);
      throw error;
    }
  }

  async updateEmployee(req, res) {
    try {
      const {
        employee_id,
        role_,
        bu,
        shift,
        sector,
        collar,
        work_schedule,
        type_,
        status,
        schedule_time,
        activity_p,
        manager_1,
      } = req.body;

      const updateQuery = `
      UPDATE employees.company_infos 
      SET
      role_ =?,
      bu =?,
      shift =?,
      sector =?,
      collar =?,
      work_schedule =?,
      type_ =?,
      status =?,
      schedule_time =?,
      activity_p =?,
      manager_1 =?
      WHERE
        employee_id = ?`;

      const values = [
        role_,
        bu,
        shift,
        sector,
        collar,
        work_schedule,
        type_,
        status,
        schedule_time,
        activity_p,
        manager_1,
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

  async updateEmployeeGroup(req, res) {
    try {
      const employeeIds = req.body.ids;
      const updatedData = req.body.updates;
  
      const updateFields = [];
      const values = [];
  
      // Iterar sobre as chaves do objeto updatedData
      Object.keys(updatedData).forEach(key => {
        // Verificar se o valor não está vazio
        if (updatedData[key] !== '') {
          updateFields.push(`${key} = ?`);
          values.push(updatedData[key]);
        }
      });
  
      // Verificar se há campos a serem atualizados
      if (updateFields.length === 0) {
        return res.status(400).json({ Status: false, Error: "Nenhum campo de atualização fornecido" });
      }
  
      const updateQuery = `
        UPDATE employees.company_infos 
        SET ${updateFields.join(', ')}
        WHERE employee_id IN (?)`;
  
      values.push(employeeIds);
  
      await new Promise((resolve, reject) => {
        pool.query(updateQuery, values, (err, result) => {
          if (err) {
            console.error("Erro durante a atualização dos registros:", err);
            return reject(err);
          }
          resolve();
        });
      });
  
      return res.status(200).json({ Status: true, Message: "Informações alteradas com sucesso!" });
    } catch (err) {
      console.error("Error during updateEmployee:", err.message);
      return res.status(500).json({ Status: false, Error: err.message });
    }
  }
  

  listEmployee = (req, res) => {
    const dbTable = req.query.dbTable;
    const query =`SELECT * FROM employees.${dbTable}`;

    pool.query(query, (error, results) => {
      if (error) {
        console.error("Erro ao executar a consulta SQL:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      } else {
        res.status(200).json(results);
      }
    });
  };

  async exportPlanning(req, res) {
    console.log("chamei o export");
    try {
      const data = await this.executeQuery(`SELECT * FROM company_infos`);

      if (data.length === 0) {
        return res
          .status(404)
          .json({ error: "Nenhum dado encontrado para exportar." });
      }

      // Formatar as datas antes de escrever no CSV usando moment
      const formattedData = data.map((row) => {
        const formattedRow = { ...row };
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

  async requestDismissal(req, res) {
    try {
      const {
        requesting_manager,
        manager_id,
        employee_id,
        employee_name,
        bu,
        reason,
        observation_disconnection,
        fit_for_hiring,
        fit_for_hiring_reason,
      } = req.body;

      const updateStatusQuery = `
        UPDATE employees.company_infos 
        SET
        status = 'TO BE FIRED'
        WHERE
          employee_id = ?`;

      const insertQuery = `
        INSERT INTO employees.dismissal_employees (
          employee_id, manager_id, requesting_manager, employee_name, bu, reason, observation_disconnection, fit_for_hiring, fit_for_hiring_reason
        )
        VALUES ?`;

      const values = [
        [
          employee_id,
          manager_id,
          requesting_manager,
          employee_name,
          bu,
          reason,
          observation_disconnection,
          fit_for_hiring,
          fit_for_hiring_reason,
        ],
      ];

      // Use Promise.all to run queries concurrently
      await Promise.all([
        this.executeQueryValues(updateStatusQuery, [employee_id]),
        this.executeQueryValues(insertQuery, [values]),
      ]);

      this.createDismissalEmail(
        "bortoletoyan@gmail.com",
        { name: "Yan", email: "bortoletoyan@gmail.com" },
        "d-d066fb34ceec47bca52cc89c608a802b",
        req.body
      );

      return res
        .status(200)
        .json({ Status: true, Message: "Registros inseridos com sucesso" });
    } catch (err) {
      console.error("Erro durante requestDismissal:", err.message);
      return res.status(500).json({ Status: false, Error: err.message });
    }
  }

  async executeQueryValues(query, values) {
    return new Promise((resolve, reject) => {
      pool.query(query, values, (err, result) => {
        if (err) {
          console.error("Erro durante a execução da query:", err);
          reject(err);
        } else {
          console.log("Inserção bem-sucedida:", result);
          resolve();
        }
      });
    });
  }

  async createDismissalEmail(to, from, templateId, dynamicTemplateData) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: Array.isArray(to) ? to : [to],
        from: {
          name: from.name,
          email: from.email,
        },
        templateId: templateId,
        dynamicTemplateData: {
          employee_id: dynamicTemplateData.employee_id,
          manager_id: dynamicTemplateData.manager_id,
          requesting_manager: dynamicTemplateData.requesting_manager,
          employee_name: dynamicTemplateData.employee_name,
          bu: dynamicTemplateData.bu,
          reason: dynamicTemplateData.reason,
          observation_disconnection:
            dynamicTemplateData.observation_disconnection,
          fit_for_hiring: dynamicTemplateData.fit_for_hiring,
        },
      };
      console.log("msg", msg.to);
      await sgMail.send(msg);
      console.log("E-mail enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar e-mail:", error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  logout(req, res) {
    res.clearCookie("token");
    return res.json({ Status: true });
  }
}

export default new PlanningController();
