import express from "express";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemBySlug,
  updateProblem,
  submitProblemForReview,
  getMyProblems
} from "../controllers/problemController.js";

import {
  authenticateUser,
  requireRole,
  requireVerifiedAccount
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all published problems
router.get("/", getAllProblems);

// Get all problems of logged-in user
router.get(
  "/my",
  authenticateUser,
  requireVerifiedAccount,
  getMyProblems
);

// Get single published problem by slug
// **Dynamic route should come after any specific routes like "/my"**
router.get("/:slug", getProblemBySlug);

// Create a new problem
router.post(
  "/",
  authenticateUser,
  requireVerifiedAccount,
  createProblem
);

// Update a problem by ID
router.put(
  "/:id",
  authenticateUser,
  requireVerifiedAccount,
  updateProblem
);

// Submit a problem for review
router.patch(
  "/:problemId/submit-review",
  authenticateUser,
  submitProblemForReview
);

// -------------------- ADMIN ROUTES -------------------- //
// Soft-delete a problem (admin only)
router.delete(
  "/:id",
  authenticateUser,
  requireRole(["ADMIN"]),
  deleteProblem
);

export default router; 
