import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";

import adminProblemRoutes from "./routes/admin/problemAdminRoutes.js";
import adminSolutionRoutes from "./routes/admin/solutionAdminRoutes.js";

import swaggerFile from "../swagger-output.json" with { type: "json" };

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

/* --- SWAGGER KILL SWITCH --- */
if (process.env.NODE_ENV !== 'production') {
  // Dynamic import for swagger-ui-express keeps your production build cleaner
  const swaggerUi = await import('swagger-ui-express');
  
  app.use('/api-docs', swaggerUi.default.serve, swaggerUi.default.setup(swaggerFile));
  console.log('📝 Swagger Docs available at http://localhost:3000/api-docs');
}

/* Public / User routes */
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/solutions", solutionRoutes);

/* Admin routes */
app.use("/api/admin/problems", adminProblemRoutes);
app.use("/api/admin/solutions", adminSolutionRoutes);

export default app;
