import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173"
];

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use('/api/auth', authRoutes);


export default app;