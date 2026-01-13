import User from "../../src/models/userModel.js";
import jwt from "jsonwebtoken";

export async function createAdmin() {
  const admin = await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: "hashed",
    role: "admin",
    isAccountVerified: true
  });

  const token = jwt.sign(
    { id: admin._id },
    process.env.ACCESS_SECRET || "test_secret"
  );

  return { admin, token };
}
