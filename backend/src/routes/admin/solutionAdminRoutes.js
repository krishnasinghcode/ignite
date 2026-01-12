import express from "express";
import {
  startSolutionReview,
  reviewSolution,
  getAllSolutionsAdmin
} from "../../controllers/solutionAdminController.js";

import {
  authenticateUser,
  requireRole
} from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser, requireRole(["admin"]));

router.get("/", getAllSolutionsAdmin);

router.patch("/:solutionId/start-review", startSolutionReview);
router.patch("/:solutionId/review", reviewSolution);

export default router;
