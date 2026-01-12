import Solution from "../models/solutionModel.js";

/**
 * Move SUBMITTED → UNDER_REVIEW
 */
export async function startSolutionReview(req, res, next) {
  try {
    const solution = await Solution.findById(req.params.solutionId);

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    if (solution.status !== "SUBMITTED") {
      return res.status(400).json({ message: "Invalid state transition" });
    }

    solution.status = "UNDER_REVIEW";
    solution.reviewedBy = req.user.id;
    solution.reviewedAt = new Date();

    await solution.save();
    res.json(solution);
  } catch (err) {
    next(err);
  }
}

/**
 * Approve / Reject solution
 */
export async function reviewSolution(req, res, next) {
  try {
    const { decision, rejectionReason } = req.body;

    const solution = await Solution.findById(req.params.solutionId);
    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    if (solution.status !== "UNDER_REVIEW") {
      return res.status(400).json({ message: "Solution not under review" });
    }

    if (decision === "APPROVE") {
      solution.status = "APPROVED";
    } else if (decision === "REJECT") {
      solution.status = "REJECTED";
      solution.rejectionReason = rejectionReason;
    } else {
      return res.status(400).json({ message: "Invalid decision" });
    }

    solution.reviewedBy = req.user.id;
    solution.reviewedAt = new Date();

    await solution.save();
    res.json(solution);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin list all solutions
 */
export async function getAllSolutionsAdmin(req, res, next) {
  try {
    const solutions = await Solution.find({})
      .populate("userId", "name email")
      .populate("problemId", "title slug")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });

    res.json(solutions);
  } catch (err) {
    next(err);
  }
}
