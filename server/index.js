// app.js
import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import { adminRouter } from "./routes/AdminRoute.js";
import { planningRouter } from "./routes/PlanningRoute.js";
import { agencyRouter } from "./routes/AgencyRoute.js";
import errorHandler from "./middleware/errorHandler.js";
import verifyUser from "./middleware/verifyUser.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/auth', adminRouter);
app.use('/planning', planningRouter);
app.use('/agency', agencyRouter);

app.use('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

// Rota para lidar com rotas não encontradas
// app.use((req, res, next) => {
//     return res.status(404).json({ Status: false, Error: "Route not found" });
// });

// Middleware para lidar com erros internos do servidor
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
