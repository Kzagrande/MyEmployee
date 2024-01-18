// routes/adminRoutes.js
import express from "express";
import adminController from "../controllers/adminController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  adminController.login(req, res);
});

router.post("/add_employee", (req, res) => {
  adminController.addEmployee(req, res);
});

router.get("/list_employee", (req, res) => {
  adminController.listEmployee(req, res);
});

router.get("/logout",verifyUser, (req, res) => {
  adminController.logout(req, res);
});

export { router as adminRouter };
