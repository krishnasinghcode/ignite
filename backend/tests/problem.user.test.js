import request from "supertest";
import app from "../src/app.js";
import { createUser } from "./helpers/createUser.js";
import Metadata from "../src/models/metaDataModel.js";

describe("Problem (User)", () => {
  beforeAll(async () => {
    await Metadata.insertMany(
      [
        { type: "CATEGORY", key: "BACKEND", label: "Backend" },
        { type: "PROBLEM_TYPE", key: "PROJECT", label: "Project" }
      ],
      { ordered: false }
    );
  });

  it("allows verified user to create problem", async () => {
    const { token } = await createUser();

    const res = await request(app)
      .post("/api/problems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Design URL Shortener",
        summary: "Design a scalable URL shortening system",
        content: `
## Context
Build a highly available URL shortener.
        `,
        category: "BACKEND",
        problemType: "PROJECT",
        difficulty: "MEDIUM",
        tags: ["system-design", "scalability"]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("DRAFT");
    expect(res.body.category).toBe("BACKEND");
    expect(res.body.problemType).toBe("PROJECT");
  });

  it("blocks unverified user", async () => {
    const { token } = await createUser({ isAccountVerified: false });

    const res = await request(app)
      .post("/api/problems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "X",
        summary: "Y",
        content: "Z",
        category: "BACKEND",
        problemType: "PROJECT",
        difficulty: "EASY"
      });

    expect(res.statusCode).toBe(403);
  });

  it("rejects invalid category", async () => {
    const { token } = await createUser();

    const res = await request(app)
      .post("/api/problems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Invalid Category Test",
        summary: "Should fail",
        content: "Markdown content",
        category: "NON_EXISTENT",
        problemType: "PROJECT",
        difficulty: "EASY"
      });

    expect(res.statusCode).toBe(400);
  });

  it("rejects inactive metadata", async () => {
    await Metadata.updateOne(
      { type: "CATEGORY", key: "BACKEND" },
      { isActive: false }
    );

    const { token } = await createUser();

    const res = await request(app)
      .post("/api/problems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Inactive Category",
        summary: "Should fail",
        content: "Markdown",
        category: "BACKEND",
        problemType: "PROJECT",
        difficulty: "MEDIUM"
      });

    expect(res.statusCode).toBe(400);
  });
});
