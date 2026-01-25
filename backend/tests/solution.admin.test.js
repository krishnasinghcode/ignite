import request from "supertest";
import app from "../src/app.js";
import { createAdmin } from "./helpers/createAdmin.js";
import Solution from "../src/models/solutionModel.js";

describe("Solution (Admin)", () => {
  it("admin approves solution directly from SUBMITTED", async () => {
    const { token } = await createAdmin();

    const solution = await Solution.create({
      userId: "507f191e810c19729de860ea",
      problemId: "507f191e810c19729de860eb",
      repositoryUrl: "https://github.com/x",
      status: "SUBMITTED",
      content: `
## Understanding
This problem requires designing a scalable cache.

## Approach
Used Redis with consistent hashing.

## Tradeoffs
- Memory usage vs latency
      `
    });

    const res = await request(app)
      .patch(`/api/admin/solutions/${solution._id}/review`)
      .set("Authorization", `Bearer ${token}`)
      .send({ decision: "APPROVE" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("APPROVED");
  });
});
