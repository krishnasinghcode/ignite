import User from "../models/userModel.js";
import Problem from "../models/problemModel.js";
import Solution from "../models/solutionModel.js";

/* --------------------- SELF --------------------- */
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email role isAccountVerified createdAt"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyProfileStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [problemsCreated, solutionsSubmitted] = await Promise.all([
      Problem.countDocuments({ createdBy: userId, deletedAt: { $exists: false } }),
      Solution.countDocuments({ userId })
    ]);

    res.status(200).json({
      problemsCreatedCount: problemsCreated,
      solutionsSubmittedCount: solutionsSubmitted
    });
  } catch (error) {
    console.error("Profile stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* --------------------- OTHER USERS --------------------- */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("name email role createdAt");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const [problemsCreated, solutionsSubmitted] = await Promise.all([
      Problem.countDocuments({ createdBy: userId, deletedAt: { $exists: false } }),
      Solution.countDocuments({ userId, isPublic: true }) // only public solutions for other users
    ]);

    res.status(200).json({
      problemsCreatedCount: problemsCreated,
      solutionsSubmittedCount: solutionsSubmitted
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getMyProfile,
  getMyProfileStats,
  getUserById,
  getUserStats
};
