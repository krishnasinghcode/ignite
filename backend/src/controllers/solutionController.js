import Solution from "../models/solutionModel.js";

/**
 * Helper to format solution object and add hasLiked attribute
 */
const formatSolution = (solution, currentUserId) => {
  if (!solution) return null;

  const solObj = solution.toObject();

  const hasLiked = currentUserId
    ? solObj.upvotes.some(id => id.toString() === currentUserId.toString())
    : false;

  delete solObj.upvotes;

  return {
    ...solObj,
    hasLiked
  };
};

/**
 * Standardize 'solutionId' to 'id' in your other functions too!
 */
export async function getSolutionById(req, res, next) {
  try {
    const { solutionId } = req.params;
    const currentUserId = req.user?.id;

    const solution = await Solution.findById(solutionId)
      .populate("userId", "name")
      .populate("problemId", "title slug");

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    const isOwner =
      currentUserId && solution.userId._id.toString() === currentUserId;

    if (!solution.isPublic && !isOwner) {
      return res.status(403).json({ message: "Access denied to private solution" });
    }

    res.json(formatSolution(solution, currentUserId));
  } catch (err) {
    next(err);
  }
}

/**
 * Get all public solutions for a specific problem
 */
export async function getSolutionsByProblem(req, res, next) {
  try {
    const { problemId } = req.params;
    const currentUserId = req.user?.id;

    const solutions = await Solution.find({
      problemId,
      isPublic: true,
      status: "APPROVED"
    })
      .populate("userId", "name")
      .sort({ upvoteCount: -1, createdAt: -1 });

    const results = solutions.map(sol => formatSolution(sol, currentUserId));
    res.json(results);
  } catch (err) {
    next(err);
  }
}

/**
 * Get all public solutions by a specific user
 * Optional query params: status (comma-separated)
 */
export async function getSolutionsByUser(req, res, next) {
  try {
    const currentUserId = req.user?.id;
    const { status } = req.query;
    const statuses = status ? status.split(",") : undefined;

    const filter = {
      userId: req.params.userId,
      isPublic: true,
    };

    if (statuses?.length) {
      filter.status = { $in: statuses };
    }

    const solutions = await Solution.find(filter)
      .populate("userId", "name") // <--- ADD THIS LINE
      .populate("problemId", "title slug");

    const results = solutions.map(sol => formatSolution(sol, currentUserId));
    res.json(results);
  } catch (err) {
    next(err);
  }
}

/**
 * Submit a solution
 */
export async function submitSolution(req, res, next) {
  try {
    const {
      problemId,
      repositoryUrl,
      content,
      techStack,
      liveDemoUrl,
      isPublic
    } = req.body;

    if (!problemId || !repositoryUrl || !content) {
      return res.status(400).json({ message: "Fields missing" });
    }

    const solution = await Solution.create({
      userId: req.user.id,
      problemId,
      repositoryUrl,
      liveDemoUrl,
      content,
      techStack,
      status: "SUBMITTED",
      isPublic: isPublic !== undefined ? isPublic : true
    });

    res.status(201).json(formatSolution(solution, req.user.id));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Solution already submitted" });
    }
    next(err);
  }
}

/**
 * Update a solution
 * - Only editable before review (SUBMITTED)
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

    if (solution.status !== "SUBMITTED") {
      return res
        .status(403)
        .json({ message: "Solution cannot be edited after submission" });
    }

    const allowedFields = [
      "repositoryUrl",
      "liveDemoUrl",
      "content",
      "techStack",
      "isPublic"
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        solution[field] = req.body[field];
      }
    });

    await solution.save();
    res.json(formatSolution(solution, req.user.id));
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a solution
 */
export async function deleteSolution(req, res, next) {
  try {
    const solution = await Solution.findById(req.params.solutionId);
    if (!solution) return res.status(404).json({ message: "Solution not found" });

    if (solution.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await solution.deleteOne();
    res.json({ message: "Solution deleted successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * UPDATED FUNCTION: toggleUpvote
 * Ensures returned data matches the initial fetch population
 */
export async function toggleUpvote(req, res, next) {
  try {
    const { solutionId } = req.params;
    const userId = req.user.id;

    const solution = await Solution.findById(solutionId);
    if (!solution) return res.status(404).json({ message: "Solution not found" });

    const hasUpvoted = solution.upvotes.some(uid => uid.toString() === userId.toString());

    const update = hasUpvoted
      ? { $pull: { upvotes: userId } }
      : { $addToSet: { upvotes: userId } };

    // Perform update and populate immediately
    let updatedSolution = await Solution.findByIdAndUpdate(solutionId, update, { new: true })
      .populate("userId", "name")
      .populate("problemId", "title slug");

    // Sync count
    updatedSolution.upvoteCount = updatedSolution.upvotes.length;
    await updatedSolution.save();

    res.status(200).json(formatSolution(updatedSolution, userId));
  } catch (err) {
    next(err);
  }
}

/**
 * Toggle solution visibility (owner only)
 */
export async function toggleSolutionVisibility(req, res, next) {
  try {
    const solution = await Solution.findById(req.params.solutionId);
    if (!solution) return res.status(404).json({ message: "Solution not found" });

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
