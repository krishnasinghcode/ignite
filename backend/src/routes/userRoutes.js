import express from "express";
import {
  getMyProfile,
  getMyProfileStats,
  getUserById,
  getUserStats
} from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ---------------- Self (requires auth) ----------------
router.get("/me", authenticateUser, getMyProfile);
router.get("/me/stats", authenticateUser, getMyProfileStats);

// ---------------- Other users (public) ----------------
router.get("/:userId", getUserById);
router.get("/:userId/stats", getUserStats);

export default router;
