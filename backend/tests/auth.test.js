import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/userModel.js";
import bcrypt from "bcryptjs";

describe("Auth API", () => {
  it("logs in a verified user", async () => {
    const password = await bcrypt.hash("password123", 10);

    await User.create({
      name: "John",
      email: "john@test.com",
      password,
      isAccountVerified: true
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "john@test.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("blocks login if user is not verified", async () => {
    const password = await bcrypt.hash("password123", 10);

    await User.create({
      name: "John",
      email: "john@test.com",
      password,
      isAccountVerified: false
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "john@test.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(403);
  });
});
