import request from "supertest";
import app from "../src/app.js";
import { createUser } from "./helpers/createUser.js";
import Problem from "../src/models/problemModel.js";

describe("Solution (User)", () => {
  it("submits solution for published problem", async () => {
    const { user, token } = await createUser();

    const problem = await Problem.create({
      title: "Queue Design",
      slug: "queue-design",
      summary: "Design queue",
      description: "Details",
      status: "PUBLISHED"
    });

    const res = await request(app)
      .post("/api/solutions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        problemId: problem._id,
        repositoryUrl: "https://github.com/test/repo"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("SUBMITTED");
  });
});
