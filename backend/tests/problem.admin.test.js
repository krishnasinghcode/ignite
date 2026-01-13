import request from "supertest";
import app from "../src/app.js";
import { createUser } from "./helpers/createUser.js";
import { createAdmin } from "./helpers/createAdmin.js";
import Problem from "../src/models/problemModel.js";

describe("Problem (Admin)", () => {
  it("admin approves problem", async () => {
    const { user } = await createUser();
    const { token: adminToken } = await createAdmin();

    const problem = await Problem.create({
      title: "Cache Design",
      slug: "cache-design",
      summary: "Design cache",
      description: "Details",
      createdBy: user._id,
      status: "PENDING_REVIEW"
    });

    const res = await request(app)
      .patch(`/api/admin/problems/${problem._id}/review`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ decision: "APPROVE" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("APPROVED");

  });

  it("blocks non-admin", async () => {
    const { token } = await createUser();

    const res = await request(app)
      .patch("/api/admin/problems/123/status")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "APPROVED" });

    expect(res.statusCode).toBe(403);
  });
});
