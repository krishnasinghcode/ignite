import Solution from "../models/solutionModel.js";

/**
 * Approve / Reject solution
 * Directly transitions from SUBMITTED to final state
 */
export async function reviewSolution(req, res, next) {
  try {
    const { decision, rejectionReason } = req.body;

    if (!["APPROVE", "REJECT"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    const updateData = {
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    };

    if (decision === "APPROVE") {
      updateData.status = "APPROVED";
      updateData.$unset = { rejectionReason: "" };
    } else {
      if (!rejectionReason?.trim()) {
        return res.status(400).json({ message: "Rejection reason required" });
      }
      updateData.status = "REJECTED";
      updateData.rejectionReason = rejectionReason;
    }

    const solution = await Solution.findOneAndUpdate(
      { 
        _id: req.params.solutionId, 
        status: { $in: ["SUBMITTED", "REJECTED"] }
      },
      updateData,
      { new: true }
    );

    if (!solution) {
      return res.status(404).json({ message: "Solution not found or already approved" });
    }

    res.json(solution);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin list all solutions with optional filtering
 */
export async function getAllSolutionsAdmin(req, res, next) {
  try {
    const { status } = req.query; // Allow admin to filter by ?status=SUBMITTED
    const query = status ? { status } : {};

    const solutions = await Solution.find(query)
      .populate("userId", "name email")
      .populate("problemId", "title slug")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });

    res.json(solutions);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get a single solution by ID with full details
 * This populates the user and problem info so the admin has full context.
 */
export async function getSolutionByIdAdmin(req, res, next) {
  try {
    const solution = await Solution.findById(req.params.solutionId)
      .populate("userId", "name email")
      .populate("problemId", "title slug description") // We include description so admin can re-read the problem
      .populate("reviewedBy", "name email");

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    res.json(solution);
  } catch (err) {
    next(err);
  }
}