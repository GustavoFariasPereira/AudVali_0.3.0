import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import  colaboradorRouter  from "./modules/colaboradores/colaborador.router";
import  emailRouter  from "./modules/emails/email.router";
import auditoriaRouter from "./modules/auditorias/auditoria.router";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/colaboradores", colaboradorRouter);
app.use("/api/emails", emailRouter);
app.use("/api/auditorias", auditoriaRouter);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI as string).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});