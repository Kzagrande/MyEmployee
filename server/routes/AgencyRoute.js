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

    // Iterar sobre os registros e inserir no banco de dados
    for (const registro of dadosCSV) {
      const [name, age, company] = registro;

      // Validar se todos os campos são fornecidos
      if (!name || !age || !company) {
        console.error('Campos obrigatórios ausentes em um registro:', registro);
        res.status(400).send('Campos obrigatórios ausentes em um registro');
        return;
      }

      // Validar o formato da idade (por exemplo, deve ser um número)
      // if (isNaN(age)) {
      //   console.error('Formato inválido para a idade em um registro:', registro);
      //   res.status(400).send('Formato inválido para a idade em um registro');
      //   return;
      // }

      // Verificar se já existe um registro com o mesmo nome
      // const existingRecord = await new Promise((resolve, reject) => {
      //   const query = 'SELECT * FROM employees.hc_test WHERE name = ?';
      //   con.query(query, [name], (err, result) => {
      //     if (err) {
      //       reject(err);
      //     } else {
      //       resolve(result);
      //     }
      //   });
      // });

      // if (existingRecord.length > 0) {
      //   console.error('Já existe um registro com o mesmo nome:', name);
      //   res.status(400).send('Já existe um registro com o mesmo nome');
      //   return;
      // }

      // Inserir o novo registro no banco de dados
      const insertQuery = 'INSERT INTO employees.hc_test (name, age, company) VALUES (?, ?, ?)';
      await new Promise((resolve, reject) => {
        con.query(insertQuery, [name, age, company], (err, result) => {
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



