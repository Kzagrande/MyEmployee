// routes/planningRoutes.js
import express from "express";
import planningController from "../controllers/planningController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/planning_login", (req, res) => {
  planningController.login(req, res);
});

router.get('/logout', verifyUser, (req, res) => {
  planningController.logout(req, res);
});

export { router as planningRouter }; // Mude para planningRouter
