import request from "supertest";
import app from "../src/app.js";
import { createUser } from "./helpers/createUser.js";
import Problem from "../src/models/problemModel.js";
import Metadata from "../src/models/metaDataModel.js";

describe("Solution (User)", () => {
  beforeAll(async () => {
    await Metadata.insertMany(
      [
        { type: "CATEGORY", key: "BACKEND", label: "Backend" },
        { type: "PROBLEM_TYPE", key: "PROJECT", label: "Project" }
      ],
      { ordered: false }
    );
  });

  it("submits solution for published problem", async () => {
    const { user, token } = await createUser();

    const problem = await Problem.create({
      title: "Queue Design",
      slug: "queue-design",
      summary: "Design a distributed queue",
      content: "## Problem\nDesign a scalable queue",
      category: "BACKEND",
      problemType: "PROJECT",
      difficulty: "MEDIUM",
      status: "PUBLISHED",
      createdBy: user._id
    });

    const res = await request(app)
      .post("/api/solutions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        problemId: problem._id,
        repositoryUrl: "https://github.com/test/repo",
        content: `
## Approach
Used Redis streams.

## Tradeoffs
Latency vs durability.
        `,
        techStack: ["Node.js", "Redis"]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("SUBMITTED");
  });
});
