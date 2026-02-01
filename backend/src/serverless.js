import app from "./app.js";
import connectDB from "./db.js";

export default async (req, res) => {
  try {
    await connectDB(process.env.MONGODB_URI);
    // Let Express handle the req/res directly
    return app(req, res);
  } catch (error) {
    console.error("Setup Error:", error);
    res.status(500).send("Internal Server Error");
  }
};