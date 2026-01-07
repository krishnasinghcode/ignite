import express from "express";
import {
  submitSolution,
  getSolutionsByUser,
  getSolutionsByProblem
} from "../controllers/solutionController.js";
import {authenticateUser} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, submitSolution);
router.get("/user/:userId", getSolutionsByUser);
router.get("/problem/:problemId", getSolutionsByProblem);

export default router;
