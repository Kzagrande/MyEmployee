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

export { router as agencyRouter };
