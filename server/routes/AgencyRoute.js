import express from "express";
import jwt from "jsonwebtoken";
import con from "../utils/db.js";
import UploadController from "../controllers/uploadAgencyController.js";

const router = express.Router();
const uploadController = new UploadController(con); // Certifique-se de passar a conexão do banco de dados correta

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

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

router.post("/upload_agency", async (req, res) => {
  try {
    // Aqui, você pode adicionar lógica de autenticação, se necessário, antes de chamar o método de upload
    // Exemplo: verificar se o usuário tem permissão para realizar o upload
    // ...

    await uploadController.uploadAgency(req, res);
  } catch (err) {
    console.error("Erro durante o upload de agências:", err);
    res.status(500).send(err.message);
  }
});

export { router as agencyRouter };
