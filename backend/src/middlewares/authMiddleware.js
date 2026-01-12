import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const user = await User.findById(decoded.id)
      .select("_id name email role isAccountVerified");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

export const requireVerifiedAccount = (req, res, next) => {
  if (!req.user?.isAccountVerified) {
    return res.status(403).json({ message: "Account not verified" });
  }

  next();
};

export const requireOwnership = (resourceUserIdField = "createdBy") => {
  return (req, res, next) => {
    const ownerId = req.resource?.[resourceUserIdField];

    if (!ownerId || ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
