import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo;

export async function connectTestDB() {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
}

export async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
}

export async function closeTestDB() {
  await mongoose.disconnect();
  if (mongo) {
    await mongo.stop();
  }
}
