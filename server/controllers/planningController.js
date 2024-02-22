// controllers/planningController.js
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import PlanningModel from "../models/planningModel.js";
import fastcsv from "fast-csv";



class PlanningController {
  login(req, res) {
    const sql =
      "SELECT * FROM employees.users_sys WHERE id_employee = ? AND password_ = ? AND status = 1";
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
            name:registro[0],
            employee_id: registro[1],
            activity_p: registro[2],
            area: registro[3],
            sector: registro[4],
            shift: registro[5],
            work_schedule: registro[6],
            type_: registro[7],
            collar: registro[8],
            status_op: registro[9],
            manager_1: registro[10],
            manager_2: registro[11],
            manager_3: registro[12],
            added_on_call: registro[113],
          })
      );

      await this.insertRecords(this.dbTable, PlanningModels);
      res.send("Registros inseridos com sucesso");

      //     const select = `SELECT
      //     ci.employee_id,
      //     pi.cpf,
      //     pi.rg,
      //     ci.role_,
      //     ci.bu,
      //     ci.shift,
      //     ci.work_schedule,
      //     ci.company,
      //     ci.status,
      //     ci.hire_date,
      //     ci.termination_date,
      //     ci.reason,
      //     pi.ethnicity,
      //     pi.gender,
      //     pi.neighborhood,
      //     pi.city,
      //     pi.email,
      //     pi.phone,
      //     ci.integration_date
      // FROM
      //     personal_infos pi
      // JOIN
      //     company_infos ci ON pi.employee_id = ci.employee_id
      //     ;
      //     `
      //     const preIntegrationCsv = await this.databaseToCsv(select);
      //     this.createAndSendCSV(
      //       preIntegrationCsv,
      //       "bortoletoyan@gmail.com",
      //       { name: "Yan", email: "bortoletoyan@gmail.com" },
      //       "d-95083a36e91245949cffc5d3fccfbcf4",
      //       { name: "Yan" }
      //     );
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
        const {name,employee_id, activity_p, area, sector,shift,work_schedule, type_, collar, status_op, manager_1, manager_2, manager_3, added_on_call } = PlanningModel;
  
        const updateQuery = `
          UPDATE employees.${table}
          SET activity_p = ?, area = ?, sector = ?, shift = ?,  work_schedule = ?, 
              type_ = ?, collar = ?, status_op = ?, manager_1 = ?, manager_2 = ?, manager_3 = ?, added_on_call = ?
          WHERE employee_id = ?`;
  
        const values = [activity_p, area, sector, shift, work_schedule, type_, collar, status_op, manager_1, manager_2, manager_3, added_on_call, employee_id];
  
        await new Promise((resolve, reject) => {
          con.query(updateQuery, values, (err, result) => {
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
        status_op,
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
      status_op =?,
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
          status_op,
          schedule_time,
          activity_p,
          manager_1,
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
        .json({ Status: true, Message: "Informações alteradas com sucesso!" });
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

  async exportPlanning(req, res) {
    try {
      const data = await this.executeQuery(
        `SELECT * FROM company_infos
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

export default new PlanningController();
