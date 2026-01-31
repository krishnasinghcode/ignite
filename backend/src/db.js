import mongoose from "mongoose";

let cachedConnection = null;

async function connectDB(uri) {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(uri, {
      bufferCommands: false,
    });

    cachedConnection = connection;
    console.log("DB connected (cached)");
    return connection;
  } catch (err) {
    console.error("Error connecting to DB:", err.message);
    throw err;
  }
}

export default connectDB;
