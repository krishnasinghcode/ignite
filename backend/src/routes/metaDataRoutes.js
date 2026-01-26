import express from "express";
import {
  getMetadata,
  createMetadata,
  updateMetadata,
  deleteMetadata,
} from "../controllers/metadataController.js";

import {authenticateUser,requireRole} from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Public / authenticated read
 */
router.get("/", getMetadata);

/**
 * Admin-only writes
 */
router.post("/", authenticateUser, requireRole("admin"), createMetadata);
router.put("/:id", authenticateUser, requireRole("admin"), updateMetadata);
router.delete("/:id", authenticateUser, requireRole("admin"), deleteMetadata);

export default router;
