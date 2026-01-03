import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            console.error("Authorization header is missing");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        if (!authHeader.startsWith("Bearer ")) {
            console.error("Authorization header malformed:", authHeader);
            return res.status(401).json({ message: "Unauthorized: Malformed token" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: user not found" });
        }

        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            console.error("TokenExpiredError:", err.message);
            return res.status(401).json({ message: "TokenExpiredError" });
        }
        console.error("Auth Middleware Error:", err.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
}