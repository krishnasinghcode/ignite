import User from "../../src/models/userModel.js";
import jwt from "jsonwebtoken";

export async function createUser(overrides = {}) {
  const user = await User.create({
    name: "Test User",
    email: "user@test.com",
    password: "hashed",
    role: "user",
    isAccountVerified: true,
    ...overrides
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.ACCESS_SECRET || "test_secret"
  );

  return { user, token };
}
