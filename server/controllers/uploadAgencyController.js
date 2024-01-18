// controllers/uploadController.js
import AgencyModel from "../models/agencyModel.js";

class UploadController {
  constructor(databaseConnection) {
    this.dbConnection = databaseConnection;
  }

  async uploadAgency(req, res) {
    try {
      const dadosCSV = req.body.csvFile;
      const dbTable = req.body.dbTable;
      this.validateInput(dadosCSV);

      // Remover o cabeçalho do CSV
      dadosCSV.shift();
      dadosCSV.pop();

      // Iterar sobre os registros e inserir no banco de dados
      for (const registro of dadosCSV) {
        const agencyModel = new AgencyModel({
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
        });

        await this.insertRecord(dbTable, agencyModel);
      }

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

  async insertRecord(table, agencyModel) {
    // Aqui você pode usar o modelo para acessar os dados do registro
    const insertQuery = `
      INSERT INTO employees.${table}(
        employee_id, name, cpf, role_, bu, shift, schedule_time, company,
        status, hire_date, date_of_birth, termination_date, reason, ethnicity,
        gender, neighborhood, city, email, phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      this.dbConnection.query(
        insertQuery,
        Object.values(agencyModel),
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log("Registro inserido com sucesso:", result);
            resolve();
          }
        }
      );
    });
  }
}

export default UploadController;
