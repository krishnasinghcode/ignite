import request from "supertest";
import app from "../src/app";
import { createUser } from "./helpers/createUser";
import { createTestProblem } from "./helpers/createTestProblem";
import { createTestSolution } from "./helpers/createTestSolution";
import Solution from "../src/models/solutionModel";

describe("Solution API", () => {
  let user, problem, token;

  beforeAll(async () => {
    await Solution.syncIndexes();
  });

  beforeEach(async () => {
    const userData = await createUser();
    user = userData.user;
    token = userData.token;

    problem = await createTestProblem({ createdBy: user._id });
  });

  describe("POST /api/solutions", () => {
    it("should allow a user to submit a solution", async () => {
      const res = await request(app)
        .post("/api/solutions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          problemId: problem._id,
          repositoryUrl: "https://github.com/user/repo",
          content: "My implementation details...",
          techStack: ["Node.js", "Redis"]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("SUBMITTED");
      expect(res.body.problemId.toString()).toBe(problem._id.toString());
    });

    it("should fail if a user tries to submit a second solution for the same problem", async () => {
      await createTestSolution({ userId: user._id, problemId: problem._id });

      const res = await request(app)
        .post("/api/solutions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          problemId: problem._id,
          repositoryUrl: "https://github.com/user/repo-2",
          content: "Another try"
        });

      // Assert: Should be 400 because of the duplicate key error catch in controller
      expect(res.statusCode).toBe(400); 
    });
  });

  describe("PATCH /api/solutions/:solutionId/upvote", () => {
    it("should allow a user to upvote a solution", async () => {
      const solution = await createTestSolution({ 
        userId: user._id, 
        problemId: problem._id 
      });

      const res = await request(app)
        .patch(`/api/solutions/${solution._id}/upvote`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.upvoteCount).toBe(1);
      expect(res.body.upvotes).toContain(user._id.toString());
    });
  });
});