import Solution from "../models/solutionModel.js";

/**
 * Submit a solution for a problem
 * - User can optionally choose if solution is public (default: true)
 * - Enforces 1 solution per user per problem via schema index
 */
export async function submitSolution(req, res, next) {
  try {
    const {
      problemId,
      repositoryUrl,
      writeup,
      techStack,
      isPublic // optional from frontend
    } = req.body;

    // Create the solution
    const solution = await Solution.create({
      userId: req.user.id,
      problemId,
      repositoryUrl,
      writeup,
      techStack,
      status: "SUBMITTED",
      isPublic: isPublic !== undefined ? isPublic : true // default true
    });

    res.status(201).json(solution);
  } catch (err) {
    // Handle duplicate submission gracefully
    if (err.code === 11000) {
      return res.status(409).json({ message: "Solution already submitted for this problem" });
    }
    next(err);
  }
}

/**
 * Get all public solutions submitted by a specific user
 * - Only returns solutions with isPublic: true
 */
export async function getSolutionsByUser(req, res, next) {
  try {
    const solutions = await Solution.find({
      userId: req.params.userId,
      isPublic: true
    }).populate("problemId", "title slug"); // populate problem title & slug

    res.json(solutions);
  } catch (err) {
    next(err);
  }
}

/**
 * Get all public solutions for a specific problem
 * - Only returns solutions with isPublic: true
 */
export async function getSolutionsByProblem(req, res, next) {
  try {
    const solutions = await Solution.find({
      problemId: req.params.problemId,
      isPublic: true,
      status: "APPROVED"
    }).populate("userId", "name"); // populate user name

    res.json(solutions);
  } catch (err) {
    next(err);
  }
}

/**
 * Optional: Toggle solution visibility (Admin or owner only)
 * - Can be used later to make solution private/public
 */
export async function toggleSolutionVisibility(req, res, next) {
  try {
    const solution = await Solution.findById(req.params.solutionId);

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    // Ensure only owner or admin can toggle
    if (solution.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: Cannot change visibility" });
    }

    solution.isPublic = !solution.isPublic;
    await solution.save();

    res.json({ message: "Visibility updated", isPublic: solution.isPublic });
  } catch (err) {
    next(err);
  }
}

/**
 * Get a single public solution by ID
 */
export async function getSolutionById(req, res, next) {
  try {
    const solution = await Solution.findOne({
      _id: req.params.solutionId,
      isPublic: true
    })
      .populate("userId", "name")
      .populate("problemId", "title slug");

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    res.json(solution);
  } catch (err) {
    next(err);
  }
}

/**
 * Update a single solution by ID
 */
export async function updateSolution(req, res, next) {
  try {
    const solution = await Solution.findById(req.params.solutionId);

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    if (solution.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 🔒 LOCK EDITS AFTER SUBMISSION
    if (["UNDER_REVIEW", "APPROVED", "REJECTED"].includes(solution.status)) {
      return res.status(403).json({
        message: "Solution cannot be edited after review has started"
      });
    }

    const allowedFields = [
      "repositoryUrl",
      "liveDemoUrl",
      "writeup",
      "techStack",
      "isPublic"
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        solution[field] = req.body[field];
      }
    });

    await solution.save();
    res.json(solution);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a single solution by ID
 */
export async function deleteSolution(req, res, next) {
  try {
    const solution = await Solution.findById(req.params.solutionId);

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    if (solution.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await solution.deleteOne();
    res.json({ message: "Solution deleted successfully" });
  } catch (err) {
    next(err);
  }
}
