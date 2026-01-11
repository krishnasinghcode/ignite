import express from "express";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemBySlug,
  publishProblem,
  updateProblem
} from "../controllers/problemController.js";
import {authenticateUser} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllProblems);
router.get("/:slug", getProblemBySlug);

// Protected (admin/system for now)
router.post("/", authenticateUser, createProblem);
router.patch("/:id/publish",authenticateUser,publishProblem);
router.put("/:id",authenticateUser,updateProblem);
router.delete("/:id",authenticateUser,deleteProblem);

export default router;
