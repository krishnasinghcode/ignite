import Problem from "../models/problemModel.js";

/**
 * Admin review: APPROVE / REJECT
 */
export async function reviewProblem(req, res, next) {
  try {
    const { decision, rejectionReason } = req.body;

    const problem = await Problem.findById(req.params.problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.status !== "PENDING_REVIEW") {
      return res.status(400).json({ message: "Problem not under review" });
    }

    if (decision === "APPROVE") {
      problem.status = "APPROVED";
    } else if (decision === "REJECT") {
      problem.status = "REJECTED";
      problem.rejectionReason = rejectionReason;
    } else {
      return res.status(400).json({ message: "Invalid decision" });
    }

    problem.reviewedBy = req.user.id;
    problem.reviewedAt = new Date();

    await problem.save();
    res.json(problem);
  } catch (err) {
    next(err);
  }
}

/**
 * Publish approved problem
 */
export async function publishProblem(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.status !== "APPROVED") {
      return res.status(400).json({ message: "Only approved problems can be published" });
    }

    problem.status = "PUBLISHED";
    await problem.save();

    res.json(problem);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin list (all problems, any status)
 */
export async function getAllProblemsAdmin(req, res, next) {
  try {
    const problems = await Problem.find({})
      .populate("createdBy", "name email")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });

    res.json(problems);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin get single problem by ID
 */
export async function getProblemByIdAdmin(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.problemId)
      .populate("createdBy", "name email")
      .populate("reviewedBy", "name email");

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    next(err);
  }
}
