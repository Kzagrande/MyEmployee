import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
const router = express.Router()

router.post("/agency_login", (req, res) => {
  const sql =
    "SELECT * from employees.users_sys Where id_employee = ? and password_ = ? and status = 2";
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
});

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({ Status: true })
})


router.post('/upload_agency', async (req, res) => {
  try {
    const dadosCSV = req.body.csvFile;
    if (!dadosCSV || dadosCSV.length === 0) {
      throw new Error('Arquivo CSV vazio ou ausente.');
    }

    // Remover o cabeçalho do CSV
    dadosCSV.shift();
    // console.log('DADOS ---->',dadosCSV)

    // Iterar sobre os registros e inserir no banco de dados
    for (const registro of dadosCSV) {
      const [employee_id, name, cpf, role_, bu, shift, schedule_time, company,
        status, hire_dateStr, date_of_birthStr, termination_dateStr, reason, ethnicity,
        gender, neighborhood, city, email, phone] = registro;
      // Validar se todos os campos são fornecidos

      const hire_date = new Date(hire_dateStr);
      const date_of_birth = new Date(date_of_birthStr);
      const termination_date = new Date(termination_dateStr);
     

      const insertQuery = `
  INSERT INTO employees.employee_list(
    employee_id, name, cpf, role_, bu, shift,schedule_time, company,
    status, hire_date, date_of_birth, termination_date, reason, ethnicity,
    gender, neighborhood, city, email, phone
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
      await new Promise((resolve, reject) => {
        con.query(insertQuery, [employee_id, name, cpf, role_, bu, shift, schedule_time,company ,
          status, hire_date, date_of_birth, termination_date, reason, ethnicity,
          gender, neighborhood, city, email, phone], (err, result) => {
            if (err) {
              reject(err);
            } else {
              console.log('Registro inserido com sucesso:', result);
              resolve();
            }
          });
      });
    }

    res.send('Registros inseridos com sucesso');
  } catch (err) {
    console.error('Erro durante o processamento do CSV:', err);
    res.status(500).send('Erro durante o processamento do CSV');
  }
});




export { router as AgencyRouter }



