import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";

import adminProblemRoutes from "./routes/admin/problemAdminRoutes.js";
import adminSolutionRoutes from "./routes/admin/solutionAdminRoutes.js";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

/* Public / User routes */
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/solutions", solutionRoutes);

/* Admin routes */
app.use("/api/admin/problems", adminProblemRoutes);
app.use("/api/admin/solutions", adminSolutionRoutes);

export default app;
