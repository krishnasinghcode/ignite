import express from "express";
import {
  submitProblemForReview,
  reviewProblem,
  publishProblem,
  getAllProblemsAdmin
} from "../../controllers/problemAdminController.js";

import {
  authenticateUser,
  requireRole
} from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser, requireRole(["admin"]));

router.get("/", getAllProblemsAdmin);

router.patch("/:problemId/submit-review", submitProblemForReview);
router.patch("/:problemId/review", reviewProblem);
router.patch("/:problemId/publish", publishProblem);

export default router;
