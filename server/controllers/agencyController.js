import AgencyModel from "../models/agencyModel.js";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import Slack from "@slack/bolt";
import dotenv from "dotenv";
import fastcsv from "fast-csv"
import fs from 'fs'


dotenv.config()
const slack = new Slack.App({
  signingSecret: process.env.SLACK_SINGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN

})

class UploadController {
  constructor() {
    this.dbTable = ""; // Inicialize a propriedade no construtor
  }

  login(req, res) {
    const sql =
      "SELECT * FROM employees.users_sys WHERE id_employee = ? AND password_ = ? AND status = 2";
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

  async logout(req, res) {
    res.clearCookie("token");
    return res.json({ Status: true });
  }



  async addEmployee(req, res) {
    try {
      const {
        employee_id,
        name,
        cpf,
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
        phone
      } = req.body;

      const sql = `
        INSERT INTO employees.agency_input_activies
        (employee_id, name, cpf, role_, bu, shift, schedule_time, company, status, hire_date, date_of_birth, ethnicity, gender, neighborhood, city, email, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        employee_id,
        name,
        cpf,
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
        phone
      ];

      con.query(sql, values, (error, results, fields) => {
        if (error) {
          console.error("Error during addEmployee:", error.message);
          return res.status(500).json({ status: false, error: error.message });
        }

        console.log("Employee data inserted successfully!");
        const insertedEmployeeId = results.insertId;
        return res.json({
          status: true,
          message: "Registros inseridos com sucesso",
          insertedEmployeeId,
          values
        });
      });
    } catch (err) {
      console.error("Error during addEmployee:", err.message);
      return res.status(500).json({ status: false, error: err.message });
    }
  }


  async uploadAgency(req, res) {
    const dadosCSV = req.body.csvFile;
    this.dbTable = req.body.dbTable;
    this.validateInput(dadosCSV);
    try {

      // Remover o cabeçalho do CSV
      dadosCSV.shift();
      dadosCSV.pop();

      // Mapear registros para modelos de agência
      const agencyModels = dadosCSV.map((registro) => new AgencyModel({
        employee_id: registro[0],
        name: registro[1],
        cpf: registro[2],
        role_: registro[3],
        bu: registro[4],
        shift: registro[5],
        schedule_time: registro[6],
        company: registro[7],
        status: registro[8],
        hire_date: new Date(registro[9]),
        date_of_birth: new Date(registro[10]),
        termination_date: new Date(registro[11]),
        reason: registro[12],
        ethnicity: registro[13],
        gender: registro[14],
        neighborhood: registro[15],
        city: registro[16],
        email: registro[17],
        phone: registro[18],
      }));

      // Inserir registros em lote
      await this.insertRecords(this.dbTable, agencyModels);

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

  async insertRecords(table, agencyModels) {
    const insertQuery = `
      INSERT INTO employees.${table}(
        employee_id, name, cpf, role_, bu, shift, schedule_time, company,
        status, hire_date, date_of_birth, termination_date, reason, ethnicity,
        gender, neighborhood, city, email, phone
      ) VALUES ?`;

    const values = agencyModels.map((agencyModel) =>
      Object.values(agencyModel)
    );

    try {
      await new Promise((resolve, reject) => {
        con.query(insertQuery, [values], (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log("Registros inseridos com sucesso:", result);
            try {
              console.log('dbTable', this.dbTable)
              slack.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL,
                text: this.dbTable == 'agency_input_activies' ? 'A Agência X acabou de subir as informações dos novos colaboradores 😁'
                  : 'A Agência x acabou de subir as informações dos novos desligados 😪'
              })
              console.log('Mensagem enviada para o Slack com sucesso.');
            } catch (slackError) {
              console.error('Erro ao enviar mensagem para o Slack:', slackError);
            }
            // Integração com a API do Slack após o sucesso da inserção
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Erro durante a inserção dos registros:", error);
      throw error;
    }
  }

  exportAgency(req, res) {
    console.log(res)
    con.query('SELECT * from employees.agency_input_activies', function (err, data) {
      if (err) {
        throw err;
      }
  
      // JSON
      const jsonData = JSON.parse(JSON.stringify(data));
      console.log("jsonData", jsonData);
  
      // CSV
      const ws = fs.createWriteStream('agency_data.csv'); // Create a writable stream
      fastcsv.write(jsonData, { headers: true })
        .on("finish", function () {
          console.log("Write to agency_data.csv successfully!");
        })
        .pipe(ws);
  
      return res.json({ Status: true });
    });
  }



}




export default new UploadController();
