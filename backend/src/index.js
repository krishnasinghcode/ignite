import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./db.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect DB once
await connectDB(MONGODB_URI);

// Only start HTTP server for local dev
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}

// Export app for serverless platforms
export default app;
