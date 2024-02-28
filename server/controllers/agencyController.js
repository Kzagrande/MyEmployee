import AgencyModel from "../models/agencyModel.js";
import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
import Slack from "@slack/bolt";
import dotenv from "dotenv";
import fastcsv from "fast-csv";
import sgMail from "@sendgrid/mail";
import { createArrayCsvWriter } from "csv-writer";
import fs from "fs/promises";
import moment from "moment";

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
    pool.query(
      sql,
      [req.body.id_employee, req.body.password],
      (err, result) => {
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
      }
    );
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

      pool.query(sql, values, (error, results, fields) => {
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

  formatDate(dateString) {
    return moment(dateString, "DD/MM/YYYY").format("YYYY-MM-DD");
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
            cpf: registro[1],
            name: registro[2],
            rg: registro[3],
            role_: registro[4],
            bu: registro[5],
            shift: registro[6],
            schedule_time: registro[7],
            company: registro[8],
            status: registro[9],
            hire_date: this.formatDate(registro[10]),
            date_of_birth: this.formatDate(registro[11]),
            termination_date: registro[12]
              ? this.formatDate(registro[12])
              : null,
            reason: registro[13],
            ethnicity: registro[14],
            gender: registro[15],
            neighborhood: registro[16],
            city: registro[17],
            email: registro[18],
            phone: registro[19],
            integration_date: this.formatDate(registro[20]),
          })
      );

      await this.insertRecords(this.dbTable, agencyModels);
      res.send("Registros inseridos com sucesso");

      const select = `   SELECT 
      ci.employee_id,
      pi.cpf,
      pi.rg,
      ci.role_,
      ci.bu,
      ci.shift,
      ci.schedule_time,    
      ci.company,
      ci.status,
      ci.hire_date,
      pi.date_of_birth,
      ci.termination_date,
      ci.reason,
      pi.ethnicity,
      pi.gender,
      pi.neighborhood,
      pi.city,
      pi.email,
      pi.phone,
      ci.integration_date
  FROM 
      personal_infos pi
  JOIN 
      company_infos ci ON pi.employee_id = ci.employee_id
      ;
      `;
      const preIntegrationCsv = await this.databaseToCsv(select);
      this.createAndSendCSV(
        preIntegrationCsv,
        ["bortoletoyan@gmail.com", "yan.bortoleto@cevalogistics.com"],
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
      pool.query(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async createAndSendCSV(dadosCSV, to, from, templateId, dynamicTemplateData) {
    // console.log(dadosCSV[0]);
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
      console.log("msg", msg.to);

      await sgMail.send(msg);

      console.log("E-mail enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar e enviar o CSV por e-mail:", error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async databaseToCsv(select) {
    const selectQuery = select;

    return new Promise((resolve, reject) => {
      pool.query(selectQuery, (err, result) => {
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
        employee_id, cpf, name, rg, role_, bu, shift, schedule_time, company,
        status, hire_date, date_of_birth, termination_date, reason, ethnicity,
        gender, neighborhood, city, email, phone,integration_date
      ) VALUES ?`;

    const values = agencyModels.map((agencyModel) =>
      Object.values(agencyModel)
    );
    // console.log(values.slice(0, 5));

    try {
      await new Promise((resolve, reject) => {
        pool.query(insertQuery, [values], (err, result) => {
          if (err) {
            reject(err);
          } else {
            // console.log("Registros inseridos com sucesso:", result);
            // try {
            //   // console.log("dbTable", this.dbTable);
            //   slack.client.chat.postMessage({
            //     token: process.env.SLACK_BOT_TOKEN,
            //     channel: process.env.SLACK_CHANNEL,
            //     text:
            //       this.dbTable == "employee_register"
            //         ? "A Agência X acabou de subir as informações dos novos colaboradores 😁"
            //         : "A Agência x acabou de subir as informações dos novos desligados 😪",
            //   });
            //   console.log("Mensagem enviada para o Slack com sucesso.");
            // } catch (slackError) {
            //   console.error(
            //     "Erro ao enviar mensagem para o Slack:",
            //     slackError
            //   );
            // }
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

  listEmployee = (req, res) => {
    const query = `SELECT 
    pi.name,
    pi.cpf,
    pi.rg,
    ci.status,
    ci.employee_id,
    ci.company,
    ci.role_,
    ci.shift,
    ci.bu,
    ci.schedule_time,
    ci.sector,
    ci.manager_1,
    ci.integration_date,
    pi.email,
    ci.presence_integration
FROM 
    personal_infos pi
JOIN 
    company_infos ci ON pi.employee_id = ci.employee_id
    WHERE  status = 'INTEGRATION'  AND integration_date BETWEEN CURRENT_DATE - INTERVAL '30' DAY AND CURRENT_DATE;`;

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
            date_of_birth: moment(employee.date_of_birth).format("DD/MM/YYYY"),
          };
        });

        // console.log('modifiedResults', modifiedResults);
        res.status(200).json(modifiedResults);
      }
    });
  };

  dismissalList = (req, res) => {
    const query = `SELECT
    de.requesting_manager,
    de.manager_id,
    de.employee_id,
    de.employee_name,
    de.bu,
    de.reason,
    de.observation_disconnection,
    de.fit_for_hiring,
    de.fit_for_hiring_reason,
    de.created_at
  FROM
    employees.dismissal_employees de
  JOIN
    employees.company_infos ci ON de.employee_id = ci.employee_id
  WHERE
    ci.status = 'TO BE FIRED';`;

    pool.query(query, (error, results) => {
      if (error) {
        console.error("Erro ao executar a consulta SQL:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      } else {
        const modifiedResults = results.map((employee) => {
          return {
            ...employee,
            created_at: moment(employee.created_at).format("DD/MM/YYYY"),
            fit_for_hiring: employee.fit_for_hiring == 1 ? "Sim" : "Não",
          };
        });

        // console.log('modifiedResults', modifiedResults);
        res.status(200).json(modifiedResults);
      }
    });
  };

  async setPresence(req, res) {
    const presenceList = req.body.ids;
    // console.log("presenceList", presenceList);

    if (
      !presenceList ||
      !Array.isArray(presenceList) ||
      presenceList.length === 0
    ) {
      return res.status(500).json({ status: false, error: error.message });
    }

    const noShowStatus = "NOSHOW";
    try {
      // Crie a consulta SQL diretamente com os valores da lista
      const updateQuery = `
        UPDATE employees.employee_register
        SET status = '${noShowStatus}'
        WHERE employee_id IN (${presenceList.join(",")})
      `;

      // Execute a consulta
      await this.executeQuery(updateQuery);

      const select = `SELECT 
      pi.name,
      pi.cpf,
      pi.rg,
      ci.employee_id,
      ci.company,
      ci.role_,
      ci.shift,
      ci.bu,
      ci.schedule_time,
      ci.sector,
      ci.manager_1,
      ci.integration_date,
      pi.email,
      ci.absence_justification,
      ci.presence_integration
  FROM 
      personal_infos pi
  JOIN 
      company_infos ci ON pi.employee_id = ci.employee_id
      WHERE status = 'INTEGRATION';
      `;
      const integrationCsv = await this.databaseToCsv(select);
      this.createAndSendCSV(
        integrationCsv,
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
      return res.status(500).json({ status: false, err: err.message });
    }
  }

  async setDismissal(req, res) {
    const dismissal_list = req.body.ids;

    if (
      !dismissal_list ||
      !Array.isArray(dismissal_list) ||
      dismissal_list.length === 0
    ) {
      return res
        .status(500)
        .json({ status: false, error: "Invalid dismissal list" });
    }

    const firedStatus = "FIRED";
    try {
      // Crie a consulta SQL diretamente com os valores da lista
      const updateQuery = `
        UPDATE employees.company_infos
        SET status = '${firedStatus}'
        WHERE employee_id IN (${dismissal_list.join(",")})
      `;

      const firedAtQuery = `
        UPDATE employees.dismissal_employees
        SET fired_at = NOW()
        WHERE employee_id IN (${dismissal_list.join(",")})
      `;

      // Execute a consulta
      await Promise.all([
        this.executeQuery(updateQuery),
        this.executeQuery(firedAtQuery),
      ]);

      return res
        .status(200)
        .json({ status: true, message: "Registros inseridos com sucesso" });
    } catch (err) {
      console.error("Erro ao marcar presença:", err);
      return res.status(500).json({ status: false, error: err.message });
    }
  }
}

export default new UploadController();
