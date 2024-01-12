import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql =
    "SELECT * from employees.admin Where id_employee = ? and password_ = ? and status = 0";
  con.query(sql, [req.body.id_employee, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const id_employee = result[0].id_employee;
      const token = jwt.sign(
        { role: "admin", id_employee: id_employee, id: result[0].id },
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

router.post("/add_employee", (req, res) => {
  const sql = `
    INSERT INTO employees.employees_list
    (name, id_employee, admission_dt, company, warehouse, bz, collar, category, sector, role_1, shift, schedule, manager_1, manager_2, manager_3, status, role_2, user_)
    VALUES (?)
  `;

  console.log('Dados recebidos no req.body:', req.body);
  const values = [
    req.body.name,
    req.body.id_employee,
    req.body.admission_dt,
    req.body.company,
    req.body.warehouse,
    req.body.bz,
    req.body.collar,
    req.body.category,
    req.body.sector,
    req.body.role_1,
    req.body.shift,
    req.body.schedule,
    req.body.manager_1,
    req.body.manager_2,
    req.body.manager_3,
    req.body.status,
    req.body.role_2,
    req.body.user_,
  ];

  // Executa a query
  con.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados:', err.message);
      return res.json({ Status: false, Error: err });
    }

    console.log('Dados inseridos com sucesso!');
    return res.json({ Status: true ,values});
  });
});

// Adicione a rota GET para obter dados da tabela employees_list
router.get("/list_employee", (req, res) => {
  const sql = `
    SELECT * FROM employees.employees_list
  `;

  // Executa a query
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Erro ao obter dados:', err.message);
      return res.json({ Status: false, Error: err });
    }

    console.log('Dados obtidos com sucesso!');
    return res.json({ Status: true, data: result });
  });
});

router.get('/logout',(req,res)=>{
    res.clearCookie('token')
    return res.json({Status:true})
})








export { router as adminRouter };
