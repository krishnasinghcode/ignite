import SavedProblem from "../models/savedProblemModel.js";
import Problem from "../models/problemModel.js";

/**
 * Toggle save / unsave a problem for the logged-in user
 * POST /api/problems/:problemId/save
 */
export async function toggleSaveProblem(req, res, next) {
  try {
    const userId = req.user.id;
    const { problemId } = req.params;

    // Ensure problem exists and is published
    const problem = await Problem.findOne({
      _id: problemId,
      status: "PUBLISHED",
      deletedAt: null
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const existingSave = await SavedProblem.findOne({
      userId,
      problemId
    });

    // If already saved → unsave
    if (existingSave) {
      await SavedProblem.deleteOne({ _id: existingSave._id });

      return res.status(200).json({
        saved: false,
        message: "Problem removed from saved items"
      });
    }

    // Else → save
    await SavedProblem.create({
      userId,
      problemId
    });

    return res.status(201).json({
      saved: true,
      message: "Problem saved successfully"
    });
  } catch (err) {
    // Handles duplicate key edge cases safely
    if (err.code === 11000) {
      return res.status(409).json({ message: "Problem already saved" });
    }
    next(err);
  }
}

/**
 * Get all saved problems for the logged-in user
 * GET /api/problems/saved
 */
export async function getMySavedProblems(req, res, next) {
  try {
    const savedProblems = await SavedProblem.find({
      userId: req.user.id
    })
      .populate({
        path: "problemId",
        select: "title slug summary category problemType difficulty tags createdAt"
      })
      .sort({ savedAt: -1 });

    res.json(savedProblems);
  } catch (err) {
    next(err);
  }
}

/**
 * Check if a problem is saved by the logged-in user
 * GET /api/problems/:problemId/is-saved
 */
export async function isProblemSaved(req, res, next) {
  try {
    const userId = req.user.id;
    const { problemId } = req.params;

    // Ensure problem exists (optional but safer)
    const problemExists = await Problem.exists({
      _id: problemId,
      status: "PUBLISHED",
      deletedAt: null
    });

    if (!problemExists) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const saved = await SavedProblem.exists({
      userId,
      problemId
    });

    return res.json({ saved: Boolean(saved) });
  } catch (err) {
    next(err);
  }
}
