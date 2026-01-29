import express from "express";
import {
  toggleSaveProblem,
  getMySavedProblems,
  isProblemSaved
} from "../controllers/savedProblemController.js";

import {
  authenticateUser,
  requireVerifiedAccount
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Toggle save
router.post(
  "/:problemId/save",
  authenticateUser,
  requireVerifiedAccount,
  toggleSaveProblem
);

// My saved problems
router.get(
  "/saved",
  authenticateUser,
  requireVerifiedAccount,
  getMySavedProblems
);

// Check saved state
router.get(
  "/:problemId/is-saved",
  authenticateUser,
  requireVerifiedAccount,
  isProblemSaved
);

export default router;
