import express from "express";;
import verifyUser from "../middleware/verifyUser.js";
import UploadController from '../controllers/agencyController.js'

const router = express.Router();



router.post("/agency_login", (req, res) => {
  UploadController.login(req, res);
});

router.get('/logout', verifyUser, (req, res) => {
  UploadController.logout(req, res);
});

router.post('/add_new_employee', verifyUser, (req, res) => {
  UploadController.addEmployee(req, res);
});


router.post("/upload_agency", async (req, res) => {
  try {
    // Aqui, você pode adicionar lógica de autenticação, se necessário, antes de chamar o método de upload
    // Exemplo: verificar se o usuário tem permissão para realizar o upload
    // ...

    await UploadController.uploadAgency(req, res);
  } catch (err) {
    console.error("Erro durante o upload de agências:", err);
    res.status(500).send(err.message);
  }
});

router.get("/export_agency", (req, res) => {
  UploadController.exportAgency(req, res);
});

router.get("/list_employee", (req, res) => {
  UploadController.listEmployee(req, res);
});

router.post("/set_presence", async (req, res) => {
  try {
    await UploadController.setPresence(req, res);
  } catch (err) {
    console.error("Erro durante o upload de agências:", err);
    res.status(500).send(err.message);
  }
});

export { router as agencyRouter };
