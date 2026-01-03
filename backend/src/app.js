import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use('/api/auth', authRoutes);


export default app;