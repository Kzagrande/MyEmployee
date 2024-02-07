import AgencyModel from "../models/agencyModel.js";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import Slack from "@slack/bolt";
import dotenv from "dotenv";
import fastcsv from "fast-csv";
import sgMail from "@sendgrid/mail";
import { createArrayCsvWriter } from "csv-writer";
import fs from "fs/promises";

dotenv.config();
const slack = new Slack.App({
  signingSecret: process.env.SLACK_SINGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

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
          { role: "agency", id_employee: id_employee, id: result[0].id },
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
        phone,
      } = req.body;

      const sql = `
        INSERT INTO employees.employee_register
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
        phone,
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
          values,
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
      dadosCSV.shift();
      dadosCSV.pop();
      const agencyModels = dadosCSV.map(
        (registro) =>
          new AgencyModel({
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
            integration_date: new Date(registro[19]),
          })
      );

      await this.insertRecords(this.dbTable, agencyModels);
      res.send("Registros inseridos com sucesso");

      const mainHc = await this.fetchDataFromHcMain();
      this.createAndSendCSV(
        mainHc,
        "bortoletoyan@gmail.com",
        { name: "Yan", email: "bortoletoyan@gmail.com" },
        "d-95083a36e91245949cffc5d3fccfbcf4",
        { name: "Yan" }
      );
    } catch (err) {
      console.error("Erro durante o processamento do CSV:", err);
      res.status(500).send(err.message);
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

  async createAndSendCSV(dadosCSV, to, from, templateId, dynamicTemplateData) {
    console.log(dadosCSV[0]);
    const csvWriter = createArrayCsvWriter({
      path: "temp.csv",
      header: dadosCSV[0],
    });
    const sliceHeader = dadosCSV.slice(1, -1);
    try {
      await csvWriter.writeRecords(sliceHeader);

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: Array.isArray(to) ? to : [to],
        from: {
          name: from.name,
          email: from.email,
        },
        templateId: templateId,
        dynamicTemplateData: {
          name: dynamicTemplateData.name,
        },
        attachments: [
          {
            content: (await fs.readFile("temp.csv")).toString("base64"),
            filename: "data.csv",
            type: "application/csv",
            disposition: "attachment",
          },
        ],
      };

      await sgMail.send(msg);

      console.log("E-mail enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar e enviar o CSV por e-mail:", error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
  
  async fetchDataFromHcMain() {
    const selectQuery = `SELECT  name, cpf, rg, employee_id, company, role_, shift, bu, schedule_time, sector, manager, status, integration_date, email, frequency, absence_justification, signature
    FROM employees.hc_main;
    `;

    return new Promise((resolve, reject) => {
      con.query(selectQuery, (err, result) => {
        if (err) {
          reject(err);
        } else {
          // Format the result as CSV-like array
          const csvArray = [];

          // Extract headers from the first row
          const headers = Object.keys(result[0]);
          csvArray.push(headers);

          // Extract data rows
          result.forEach((row) => {
            const rowData = headers.map((header) => row[header]);
            csvArray.push(rowData);
          });

          resolve(csvArray);
        }
      });
    });

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
        gender, neighborhood, city, email, phone,integration_date
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
            // console.log("Registros inseridos com sucesso:", result);
            try {
              // console.log("dbTable", this.dbTable);
              slack.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL,
                text:
                  this.dbTable == "employee_register"
                    ? "A Agência X acabou de subir as informações dos novos colaboradores 😁"
                    : "A Agência x acabou de subir as informações dos novos desligados 😪",
              });
              console.log("Mensagem enviada para o Slack com sucesso.");
            } catch (slackError) {
              console.error(
                "Erro ao enviar mensagem para o Slack:",
                slackError
              );
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

  async exportAgency(req, res) {
    try {
      const data = await this.executeQuery(
        "SELECT * FROM employees.employee_register"
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
      console.log(res);
    } catch (err) {
      console.error("Erro:", err);
      return res
        .status(500)
        .json({ error: "Erro ao exportar dados da agência" });
    }
  }



  async listEmployee(req, res) {
    try {
      const data = await this.executeQuery(
        "SELECT * FROM employees.hc_main WHERE signature IS NULL"
      );
      res.status(200).json(data);
    } catch (err) {
      console.error("Erro:", err);
      return res.status(500).json({ status: false, error: err.message });
    }
  }

  async setPresence(req, res) {
    const presenceList = req.body.ids;
    console.log("presenceList", presenceList);

    if (
      !presenceList ||
      !Array.isArray(presenceList) ||
      presenceList.length === 0
    ) {
      return res.status(500).json({ status: false, error: error.message });
    }

    const presenceStatus = "PRESENT";

    try {
      // Crie a consulta SQL diretamente com os valores da lista
      const updateQuery = `
        UPDATE employees.hc_main
        SET signature = '${presenceStatus}'
        WHERE employee_id IN (${presenceList.join(",")})
      `;

      // Execute a consulta
      await this.executeQuery(updateQuery);
      const mainHc = await this.fetchDataFromHcMain();
      this.createAndSendCSV(
        mainHc,
        "bortoletoyan@gmail.com",
        { name: "Yan", email: "bortoletoyan@gmail.com" },
        "d-eaf3e8a86d354c3090a764f706444b8d",
        { name: "Yan" }
      );
      return res.json({
        status: true,
        message: "Registros inseridos com sucesso",
      });
    } catch (err) {
      console.error("Erro ao marcar presença:", err);
      return res.status(500).json({ status: false, err: error.message });
    }
  }

  }

export default new UploadController();
