import Problem from "../models/problemModel.js";
import SavedProblem from "../models/savedProblemModel.js";
import { generateUniqueSlug } from "../services/slug.js";
import { validateMetadata } from "../services/metadataValidator.js";

/**
 * Create a new problem
 * - Accepts all fields including arrays for objectives, constraints, assumptions, tags, expectedDeliverables, evaluationCriteria
 * - status can be "DRAFT" or "PENDING_REVIEW" depending on user action
 */
export async function createProblem(req, res, next) {
  try {
    const {
      title,
      summary,
      content,
      category,
      problemType,
      difficulty = "EASY",
      tags = [],
      status = "DRAFT"
    } = req.body;

    if (!title || !summary || !content || !category || !problemType) {
      return res.status(400).json({
        message: "Title, summary, content, category, and problemType are required."
      });
    }

    await validateMetadata({
      category: category.toUpperCase(),
      problemType: problemType.toUpperCase()
    });

    const slug = await generateUniqueSlug(title);

    const problem = await Problem.create({
      title,
      slug,
      summary,
      content,
      category: category.toUpperCase(),
      problemType: problemType.toUpperCase(),
      difficulty: difficulty.toUpperCase(),
      tags,
      status,
      createdBy: req.user.id
    });

    res.status(201).json(problem);
  } catch (err) {
    next(err);
  }
}

/**
 * Get all published problems with optional filters
 * Supports ?saved=true for logged-in users
 */
export async function getAllProblems(req, res, next) {
  try {
    const { q, tags, category, problemType, difficulty, saved } = req.query;

    const filter = {
      status: "PUBLISHED",
      deletedAt: null,
    };

    if (category) filter.category = category.toUpperCase();
    if (problemType) filter.problemType = problemType.toUpperCase();
    if (difficulty) filter.difficulty = difficulty.toUpperCase();
    if (tags) filter.tags = { $in: tags.split(",").map(t => t.trim()) };
    if (q) filter.$text = { $search: q };

    let problems = await Problem.find(filter)
      .select("title slug summary category problemType difficulty tags createdAt")
      .sort({ createdAt: -1 })
      .limit(50);

    if (req.user) {
      const savedDocs = await SavedProblem.find({ userId: req.user._id }).select("problemId");
      const savedIds = new Set(savedDocs.map(sp => sp.problemId.toString()));

      // If saved filter is requested, only keep saved problems
      if (saved === "true") {
        problems = problems.filter(p => savedIds.has(p._id.toString()));
      }

      // Mark which problems are saved
      problems = problems.map(p => ({
        ...p.toObject(),
        saved: savedIds.has(p._id.toString()),
      }));
    }

    res.json(problems);
  } catch (err) {
    next(err);
  }
}

/**
 * Get a single published problem by slug
 */
export async function getProblemBySlug(req, res, next) {
  try {
    const problem = await Problem.findOne({
      slug: req.params.slug,
      status: "PUBLISHED"
    });

    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.json(problem);
  } catch (err) {
    next(err);
  }
}

/**
 * Update a problem
 * - Only editable if DRAFT or REJECTED
 * - Regenerates slug if title changes
 */
export async function updateProblem(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!["DRAFT", "REJECTED"].includes(problem.status)) {
      return res.status(403).json({ message: "Problem cannot be edited in current state" });
    }

    // Validate category/problemType if provided
    if (req.body.category) {
      const categoryMeta = await Metadata.findOne({ type: "CATEGORY", key: req.body.category.toUpperCase(), isActive: true });
      if (!categoryMeta) return res.status(400).json({ message: `Invalid category: ${req.body.category}` });
      problem.category = req.body.category.toUpperCase();
    }

    if (req.body.problemType) {
      const problemTypeMeta = await Metadata.findOne({ type: "PROBLEM_TYPE", key: req.body.problemType.toUpperCase(), isActive: true });
      if (!problemTypeMeta) return res.status(400).json({ message: `Invalid problem type: ${req.body.problemType}` });
      problem.problemType = req.body.problemType.toUpperCase();
    }

    // Regenerate slug if title changes
    if (req.body.title && req.body.title !== problem.title) {
      problem.slug = await generateUniqueSlug(req.body.title);
      problem.title = req.body.title;
    }

    // Update other fields
    ["summary", "content", "difficulty", "tags", "status"].forEach(field => {
      if (req.body[field] !== undefined) {
        problem[field] = field === "difficulty" ? req.body[field].toUpperCase() : req.body[field];
      }
    });

    await problem.save();
    res.json(problem);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a problem (soft delete)
 */
export async function deleteProblem(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.createdBy.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    problem.deletedAt = new Date();
    problem.status = "DRAFT";
    await problem.save();

    res.json({ message: "Problem deleted successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * Submit a draft problem for review
 */
export async function submitProblemForReview(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.status !== "DRAFT") return res.status(400).json({ message: "Only draft problems can be submitted for review" });

    problem.status = "PENDING_REVIEW";
    await problem.save();

    res.json(problem);
  } catch (err) {
    next(err);
  }
}

/**
 * Get all problems created by the logged-in user (filtered by status)
 */
export async function getMyProblems(req, res, next) {
  try {
    const { status } = req.query;

    const query = {
      createdBy: req.user.id,
      deletedAt: null
    };

    // Allow single or multiple statuses
    if (status) {
      query.status = { $in: status.split(",") };
    }

    const problems = await Problem.find(query).sort({ createdAt: -1 });

    res.json(problems);
  } catch (err) {
    next(err);
  }
}

/**
 * Get single problem by ID (author-only preview)
 */
export async function getProblemById(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.createdBy.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    res.json(problem);
  } catch (err) {
    next(err);
  }
}
