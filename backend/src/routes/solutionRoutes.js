import express from "express";
import {
  submitSolution,
  getSolutionsByUser,
  getSolutionsByProblem,
  getSolutionById,
  updateSolution,
  deleteSolution,
  toggleUpvote
} from "../controllers/solutionController.js";

import {
  authenticateUser,
  requireVerifiedAccount,
  extractUserOptional
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public (approved only – enforce in controller)
router.get("/problem/:problemId", extractUserOptional, getSolutionsByProblem);
router.get("/:solutionId", extractUserOptional, getSolutionById);

// User
router.post(
  "/",
  authenticateUser,
  requireVerifiedAccount,
  submitSolution
);

router.put(
  "/:solutionId",
  authenticateUser,
  updateSolution
);

router.delete(
  "/:solutionId",
  authenticateUser,
  deleteSolution
);

// User-specific (authenticated)
router.get(
  "/user/:userId",
  authenticateUser,
  getSolutionsByUser
);

router.post(
  "/:solutionId/upvote",
  authenticateUser,
  toggleUpvote);

export default router;
