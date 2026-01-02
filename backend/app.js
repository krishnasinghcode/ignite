import express from 'express';
import cors from 'cors';
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

export default app;