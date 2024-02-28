import express from "express";
import UploadController from "../controllers/agencyController.js";

const router = express.Router();

router.post("/agency_login", (req, res) => {
  UploadController.login(req, res);
});

router.get("/logout", (req, res) => {
  UploadController.logout(req, res);
});

router.post("/add_new_employee", (req, res) => {
  UploadController.addEmployee(req, res);
});

router.post("/upload_agency", async (req, res) => {
  try {
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

router.get("/dismissal_list", (req, res) => {
  UploadController.dismissalList(req, res);
});

router.post("/set_dismissal", (req, res) => {
  UploadController.setDismissal(req, res);
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
