import request from "supertest";
import app from "../src/app.js";
import { createUser } from "./helpers/createUser.js";

describe("Problem (User)", () => {
  it("allows verified user to create problem", async () => {
    const { token } = await createUser();

    const res = await request(app)
      .post("/api/problems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Design URL Shortener",
        summary: "System design problem",
        description: "Design a scalable system",
        domain: "Backend",
        difficulty: "Medium"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("DRAFT");
  });

  it("blocks unverified user", async () => {
    const { token } = await createUser({ isAccountVerified: false });

    const res = await request(app)
      .post("/api/problems")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "X", summary: "Y", description: "Z" });

    expect(res.statusCode).toBe(403);
  });
});
