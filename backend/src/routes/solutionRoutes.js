import express from "express";
import {
  submitSolution,
  getSolutionsByUser,
  getSolutionsByProblem,
  getSolutionById,
  updateSolution,
  deleteSolution
} from "../controllers/solutionController.js";

import {
  authenticateUser,
  requireVerifiedAccount
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public (approved only – enforce in controller)
router.get("/problem/:problemId", getSolutionsByProblem);
router.get("/:solutionId", getSolutionById);

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

export default router;
