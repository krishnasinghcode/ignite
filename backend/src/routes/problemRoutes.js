import express from "express";
import {
  createProblem,
  getAllProblems,
  getProblemBySlug,
  publishProblem
} from "../controllers/problemController.js";
import {authenticateUser} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllProblems);
router.get("/:slug", getProblemBySlug);

// Protected (admin/system for now)
router.post("/", authenticateUser, createProblem);
router.patch("/:id/publish",authenticateUser,publishProblem);


export default router;
