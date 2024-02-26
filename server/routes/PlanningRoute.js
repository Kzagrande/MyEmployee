// routes/planningRoutes.js
import express from "express";
import planningController from "../controllers/planningController.js";


const router = express.Router();

router.post("/planning_login", (req, res) => {
  planningController.login(req, res);
});

router.get("/list_employee", (req, res) => {
  planningController.listEmployee(req, res);
});

router.post("/update_planning_employee", (req, res) => {
  planningController.updateEmployee(req, res);
});

router.get("/export_planning_infos", (req, res) => {
  planningController.exportPlanning(req, res);
});


router.get('/logout', (req, res) => {
  planningController.logout(req, res);
});

router.post("/upload_pd_infos", async (req, res) => {
  try {
    // Aqui, você pode adicionar lógica de autenticação, se necessário, antes de chamar o método de upload
    // Exemplo: verificar se o usuário tem permissão para realizar o upload
    // ...

    await planningController.uplaodPdInfos(req, res);
  } catch (err) {
    console.error("Erro durante o upload de agências:", err);
    res.status(500).send(err.message);
  }
});



export { router as planningRouter }; // Mude para planningRouter
