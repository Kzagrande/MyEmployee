import AgencyModel from "../models/agencyModel.js";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import Slack from "@slack/bolt";
import dotenv from "dotenv";
import fastcsv from "fast-csv";
import iconv from "iconv-lite";
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

    console.log("");
    const csvWriter = createArrayCsvWriter({
      path: "temp.csv", // Especifique o caminho e o nome do arquivo temporário
      header: dadosCSV[0],
    });

    // console.log('CSV',dadosCSV)
    const sliceHeader = dadosCSV.slice(1, -1);
    await csvWriter.writeRecords(sliceHeader);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: ["yan.bortoleto@cevalogistics.com"],
      from: {
        name: "Yan",
        email: "bortoletoyan@gmail.com",
      },
      templateId: "d-95083a36e91245949cffc5d3fccfbcf4",
      dynamicTemplateData: {
        name: "Yan",
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

    (async () => {
      try {
        console.log("OPA ENTREI AQUI EM -->");
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    })();

    try {
      // Remover o cabeçalho do CSV
      dadosCSV.shift();
      dadosCSV.pop();

      // Mapear registros para modelos de agência
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
          })
      );

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
            // console.log("Registros inseridos com sucesso:", result);
            try {
              // console.log("dbTable", this.dbTable);
              slack.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: process.env.SLACK_CHANNEL,
                text:
                  this.dbTable == "agency_input_activies"
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
        "SELECT * FROM employees.agency_input_activies"
      );
      const jsonData = JSON.parse(JSON.stringify(data));

      const utf8Data = iconv.encode(JSON.stringify(jsonData), "utf-8");

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

  async listEmployee(req, res) {
    try {
      const data = await this.executeQuery(
        "SELECT * FROM employees.agency_input_activies WHERE presence_integration IS NULL"
      );
      res.status(200).json(data);
    } catch (err) {
      console.error("Erro:", err);
      return res.status(500).json({ status: false, error: err.message })
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
      return res.status(500).json({ status: false, error: error.message })
    }

    const presenceStatus = "PRESENTE";

    try {
      // Crie a consulta SQL diretamente com os valores da lista
      const updateQuery = `
        UPDATE employees.agency_input_activies
        SET presence_integration = '${presenceStatus}'
        WHERE employee_id IN (${presenceList.join(",")})
      `;

      // Execute a consulta
      await this.executeQuery(updateQuery);

      return res.json({
        status: true,
        message: "Registros inseridos com sucesso",
      });
    } catch (err) {
      console.error("Erro ao marcar presença:", err);
      return res.status(500).json({ status: false, err: error.message })
    }
  }
}

export default new UploadController();
