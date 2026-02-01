import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminProblemRoutes from "./routes/admin/problemAdminRoutes.js";
import adminSolutionRoutes from "./routes/admin/solutionAdminRoutes.js";
import metaDataRoutes from "./routes/metaDataRoutes.js";
import savedProblemRoutes from "./routes/savedProblemRoutes.js";

import swaggerFile from "../swagger-output.json" with { type: "json" };

const app = express();

/* -------- Core middleware -------- */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Health check route (Useful to see if the server is alive)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

/* -------- Request Logger (Toggleable) -------- */
// Only run if specifically enabled AND not in production
const shouldLog = process.env.ENABLE_API_LOG === "true" && process.env.NODE_ENV !== "production";

if (shouldLog) {
  app.use((req, res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] 🛰️  ${req.method} ${req.url}`);
    
    // Safety check: Never log bodies in production, even if toggled on
    const isAuth = req.url.includes('/auth');
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(req.method);

    if (hasBody && !isAuth) {
      console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    }
    next();
  });
}

/* -------- Public / user routes -------- */
app.use("/api/users", userRoutes);
app.use("/api/metadata", metaDataRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/problems", savedProblemRoutes);
app.use("/api/solutions", solutionRoutes);

/* -------- Admin routes -------- */
app.use("/api/admin/problems", adminProblemRoutes);
app.use("/api/admin/solutions", adminSolutionRoutes);

/* -------- Swagger (Conditional Setup) -------- */
// We use a standard check here; avoid top-level await if it causes hangs in Dev
if (process.env.NODE_ENV !== "production") {
  try {
    const swaggerUi = await import("swagger-ui-express");
    app.use("/api-docs", swaggerUi.default.serve, swaggerUi.default.setup(swaggerFile));
  } catch (err) {
    console.error("Failed to load Swagger:", err);
  }
}

/* -------- 404 Catch-all -------- */
// This ensures that if a route is wrong, you get an error instead of "Pending"
app.use((req, res) => {
  console.log(`Unmatched Route: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found", path: req.url });
});

export default app;