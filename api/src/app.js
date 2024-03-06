import express from "express";
import morgan from "morgan";


//Routes
import userRoutes from "./routes/user.route";
import appointmentRoutes from "./routes/appointment.route";
import subsidiaryRoutes from "./routes/subsidiary.route";

const cors = require('cors');
const app = express();

//settings
app.set("port", 3600);

//Middlewares: funciones intermedias entre una peticion y una respuesta
app.use(morgan("dev"));
app.use(express.json());
//app.use(cors());  // Todo el mundo (No recomendado)

const whiteList = [
    'http://localhost:8084'
];
app.use(cors({origin:[whiteList]})) // Solo para dominios permitidos de la lista (Recomendable)

//Routes
app.use("/api/users", userRoutes);
app.use("/api/subsidiaries", subsidiaryRoutes);
app.use("/api/appointments", appointmentRoutes);

export default app;
