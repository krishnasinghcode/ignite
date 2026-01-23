import express from "express";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemBySlug,
  updateProblem,
  submitProblemForReview,
  getMyProblems,
  getProblemById
} from "../controllers/problemController.js";

import {
  authenticateUser,
  requireRole,
  requireVerifiedAccount
} from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * PUBLIC ROUTES
 */

// Get all published problems
router.get("/", getAllProblems);

// Get single published problem by slug (KEEP THIS LAST among public routes)
router.get("/:slug", getProblemBySlug);

/**
 * AUTHENTICATED USER ROUTES
 */

// Create a new problem
router.post(
  "/",
  authenticateUser,
  requireVerifiedAccount,
  createProblem
);

// Get all problems of logged-in user
router.get(
  "/my",
  authenticateUser,
  requireVerifiedAccount,
  getMyProblems
);

// Get problem by ID (author-only preview)
router.get(
  "/by-id/:id",
  authenticateUser,
  requireVerifiedAccount,
  getProblemById
);

// Update a problem
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

/**
 * ADMIN ROUTES
 */

router.delete(
  "/:id",
  authenticateUser,
  requireRole(["ADMIN"]),
  deleteProblem
);

export default router;
