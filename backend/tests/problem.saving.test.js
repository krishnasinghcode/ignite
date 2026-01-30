import request from "supertest";
import app from "../src/app";

import { createUser } from "./helpers/createUser";
import { createTestProblem } from "./helpers/createTestProblem";
import { createTestSavedProblem } from "./helpers/createTestSavedProblem";

describe("user saving problems", () => {
  it("user saves a problem", async () => {
    const user = await createUser();
    const problem = await createTestProblem({
      createdBy: user.user._id,
    });

    const res = await request(app)
      .post(`/api/problems/${problem._id}/save`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.saved).toBe(true);
  });

  it("user unsaves a problem", async () => {
  const { token, problem } = await createTestSavedProblem();

  const res = await request(app)
    .post(`/api/problems/${problem._id}/save`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.saved).toBe(false);
});
});
