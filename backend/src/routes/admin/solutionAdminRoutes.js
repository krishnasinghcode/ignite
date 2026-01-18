import express from "express";
import {
  reviewSolution,
  getAllSolutionsAdmin,
  getSolutionByIdAdmin
} from "../../controllers/solutionAdminController.js";

import {
  authenticateUser,
  requireRole
} from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Middleware: All routes below this require admin privileges
router.use(authenticateUser, requireRole(["admin"]));

// 1. List all solutions (can take ?status= query)
router.get("/", getAllSolutionsAdmin);

// 2. Get details for a single solution for the Detail Page
router.get("/:solutionId", getSolutionByIdAdmin); 

// 3. Status Transitions
router.patch("/:solutionId/review", reviewSolution);

export default router;