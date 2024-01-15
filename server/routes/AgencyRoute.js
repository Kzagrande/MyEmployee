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
  const dadosCSV = req.body.csvFile;
  console.log('Dados recebidos:', dadosCSV);

  // Remover o cabeçalho do CSV
  dadosCSV.shift();

  // Iterar sobre os registros e inserir no banco de dados
  for (const registro of dadosCSV) {
    const [name, age, company] = registro;
    const query = 'INSERT INTO employees.hc_test (name, age, company) VALUES (?, ?, ?)';

    try {
      await new Promise((resolve, reject) => {
        con.query(query, [name, age, company], (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log('Registro inserido com sucesso:', result);
            resolve();
          }
        });
      });
    } catch (err) {
      console.error('Erro ao inserir registro:', err);
      res.status(500).send('Erro ao inserir registros');
      return;
    }
  }

  res.send('Registros inseridos com sucesso');
});




export { router as AgencyRouter }



