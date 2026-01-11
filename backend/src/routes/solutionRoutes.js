import express from "express";
import {
  submitSolution,
  getSolutionsByUser,
  getSolutionsByProblem,
  getSolutionById,
  updateSolution,
  deleteSolution
} from "../controllers/solutionController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, submitSolution);
router.get("/user/:userId", getSolutionsByUser);
router.get("/problem/:problemId", getSolutionsByProblem);
router.get("/:solutionId", getSolutionById);
router.put("/:solutionId", authenticateUser, updateSolution);
router.delete("/:solutionId", authenticateUser, deleteSolution);

export default router;
