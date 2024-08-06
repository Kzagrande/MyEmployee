// controllers/planningController.js
import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
import PlanningModel from "../models/planningModel.js";
import fastcsv from "fast-csv";
import sgMail from "@sendgrid/mail";
import moment from "moment";
import Employee from "../models/Employee.js";

class PlanningController {
  login(req, res) {
    const sql =
      "SELECT * FROM employees.users_sys WHERE employee_id = ? AND password_ = ? AND status_ BETWEEN 5 AND 10;";

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
            { role: "planning", employee_id: employee_id,user_name: user_name, id: result[0].id },
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

  async findEmployeeById(req, res) {
    try {
      const employeeId = req.params.employeeId;
      // console.log('req', req.params);
      const employee = await Employee.findOne({ where: { employee_id: employeeId } });
  
      if (employee) {
        res.json({ name: employee.name, bu: employee.bu });
      } else {
        res.status(404).json({ error: 'Colaborador não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao buscar informações do colaborador:', error);
      res.status(500).json({ error: 'Erro ao buscar informações do colaborador' });
    }
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
            sector: registro[2],
            work_schedule: registro[3],
            type_: registro[4],
            manager_1: registro[5],
            manager_2: registro[6],
            manager_3: registro[7]
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
          sector,
          work_schedule,
          type_,
          status,
          manager_1,
          manager_2,
          manager_3,
        } = PlanningModel;

        const updateQuery = `
          UPDATE employees.${table}
          SET  sector = ?, work_schedule = ?, 
              type_ = ?, status = ?, manager_1 = ?, manager_2 = ?, manager_3 = ?
          WHERE employee_id = ?`;

        const values = [
          sector,
          work_schedule,
          type_,
          status,
          manager_1,
          manager_2,
          manager_3,
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
        manager_1,
      } = req.body.data;

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
      this.editsLog(req.body.oldData,req.body.newData,req.body.ids)

      return res
        .status(200)
        .json({ Status: true, Message: "Informações alteradas com sucesso!" });
    } catch (err) {
      console.error("Error during updateEmployee:", err.message);
      return res.status(500).json({ Status: false, Error: err.message });
    }
  }

  async editsLog(oldData,newData,ids){


    const editedFields = Object.keys(newData);
    try {
    for (const field of editedFields) {
      // Montar o objeto de dados para inserção na tabela edit_history
      const logData = {
        editor_id: ids.editor_id,
        employee_id: ids.employee_id,
        edited_field: field,
        old_value: oldData[field],
        new_value: newData[field]
      };
      pool.query('INSERT INTO edit_history SET ?', logData)
    }
    console.log("Registros de edição inseridos com sucesso.");
    
    } catch (error) {
      console.error("Erro ao inserir registros de edição:", error);
    }
  }

  async editsLogGroup(oldData,newData,ids){

    const editedFields = Object.keys(newData);
    try {
      for (const employee_id of ids.employee_id) {
        // Iterar sobre cada campo modificado
        for (const field of editedFields) {
          // Montar o objeto de dados para inserção na tabela edit_history
          const logData = {
            editor_id: ids.editor_id,
            employee_id: employee_id,
            edited_field: field,
            old_value: oldData[field],
            new_value: newData[field]
          };
      pool.query('INSERT INTO edit_history SET ?', logData)
    }
  }
    console.log("Registros de edição inseridos com sucesso.");
    
    } catch (error) {
      console.error("Erro ao inserir registros de edição:", error);
    }
  }

  async updateEmployeeGroup(req, res) {
    console.log('req',req.body)
    try {
      const employeeIds = req.body.ids;
      const updatedData = req.body.updates.data; // tira o editor_id que não tem na tabela company infos
      const cleanData = { ...updatedData };
      delete cleanData.editor_id;
  
      const updateFields = [];
      const values = [];
  
      // Iterar sobre as chaves do objeto updatedData
      Object.keys(cleanData).forEach(key => {
        // Verificar se o valor não está vazio
        if (cleanData[key] !== '') {
          updateFields.push(`${key} = ?`);
          values.push(cleanData[key]);
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
  
      this.editsLogGroup(req.body.updates.oldData,req.body.updates.newData,req.body.updates.ids)
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
        termination_type,
        observation_disconnection,
        fit_for_hiring,
        fit_for_hiring_reason,
      } = req.body;

      const dismissal_date = new Date()

      // const updateStatusQuery = `
      //   UPDATE employees.company_infos 
      //   SET
      //   status = 'TO BE FIRED'
      //   WHERE
      //     employee_id = ?`;

      const insertQuery = `
        INSERT INTO employees.manager_requests (
          employee_id, manager_id, requesting_manager, employee_name,dismissal_date, bu, reason,termination_type, observation_disconnection, fit_for_hiring, fit_for_hiring_reason
        )
        VALUES ?`;

      const values = [
        [
          employee_id,
          manager_id,
          requesting_manager,
          employee_name,
          dismissal_date,
          bu,
          reason,
          termination_type,
          observation_disconnection,
          fit_for_hiring,
          fit_for_hiring_reason,
        ],
      ];

      // Use Promise.all to run queries concurrently
      await Promise.all([
        // this.executeQueryValues(updateStatusQuery, [employee_id]),
        this.executeQueryValues(insertQuery, [values]),
      ]);

      // this.createDismissalEmail(
      //   "bortoletoyan@gmail.com",
      //   { name: "Yan", email: "bortoletoyan@gmail.com" },
      //   "d-d066fb34ceec47bca52cc89c608a802b",
      //   req.body
      // );

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

  async setNoShow(req, res) {
    const no_show_list = req.body.ids;

    if (
      !no_show_list ||
      !Array.isArray(no_show_list) ||
      no_show_list.length === 0
    ) {
      return res.status(500).json({ status: false, error: error.message });
    }

    const noShowStatus = "NO SHOW";
    try {
      // Crie a consulta SQL diretamente com os valores da lista
      const updateQuery = `
        UPDATE employees.employee_register
        SET status = '${noShowStatus}'
        WHERE employee_id IN (${no_show_list.join(",")})
      `;

      const dismissalQuery = `INSERT INTO dismissal_employees (employee_id, employee_name,dismissal_date, termination_type, reason, communication_date)
      SELECT employee_id, name, NOW(),'DESISTENCIA', 'DESISTENCIA',  NOW()
      FROM employee_register
      WHERE employee_id IN (${no_show_list.join(",")})
      `

      // Execute a consulta
      await this.executeQuery(updateQuery);
      await this.executeQuery(dismissalQuery);

      return res.json({
        status: true,
        message: "Registros inseridos com sucesso",
      });
    } catch (err) {
      console.error("Erro ao marcar presença:", err);
      return res.status(500).json({ status: false, err: err.message });
    }
  }

  logout(req, res) {
    res.clearCookie("token");
    return res.json({ Status: true });
  }
}

export default new PlanningController();
