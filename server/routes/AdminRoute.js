// routes/adminRoutes.js
import express from "express";
import adminController from "../controllers/adminController.js";


const router = express.Router();


router.post("/adminlogin", (req, res) => {
  adminController.login(req, res);
});

router.post("/add_hr_employees", (req, res) => {
  adminController.addEmployee(req, res);
});
router.post("/update_hr_employee", (req, res) => {
  adminController.updateEmployee(req, res);
});

router.get("/list_employee", (req, res) => {
  adminController.listEmployee(req, res);
});

router.get("/export_active_hc", (req, res) => {
  adminController.exportActiveHc(req, res);
});


router.post("/update_dismissal_group", (req, res) => {
  adminController.updateDismissalGroup(req, res);
});

router.get('/logout', (req, res) => {
  adminController.logout(req, res);
});

export { router as adminRouter };
