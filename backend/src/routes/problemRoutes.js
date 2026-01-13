import express from "express";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemBySlug,
  updateProblem,
  submitProblemForReview
} from "../controllers/problemController.js";

import {
  authenticateUser,
  requireRole,
  requireVerifiedAccount
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllProblems);
router.get("/:slug", getProblemBySlug);

// User (verified)
router.post(
  "/",
  authenticateUser,
  requireVerifiedAccount,
  createProblem
);

router.put(
  "/:id",
  authenticateUser,
  requireVerifiedAccount,
  updateProblem
);

router.patch(
  "/:problemId/submit-review",
  authenticateUser,
  submitProblemForReview
);

router.delete(
  "/:id",
  authenticateUser,
  requireRole(["ADMIN"]),
  deleteProblem
);

export default router; 
