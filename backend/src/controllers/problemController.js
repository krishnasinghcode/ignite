import Problem from "../models/problemModel.js";
import { generateUniqueSlug } from "../services/slug.js";

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
      description,
      context,
      objectives = [],
      constraints = [],
      assumptions = [],
      domain,
      difficulty,
      tags = [],
      expectedDeliverables = [],
      evaluationCriteria = [],
      status = "DRAFT" // default draft
    } = req.body;

    // Validate required fields
    if (!title || !summary || !description) {
      return res.status(400).json({ message: "Title, summary, and description are required." });
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(title);

    const problem = await Problem.create({
      title,
      slug,
      summary,
      description,
      context: context || "",
      objectives,
      constraints,
      assumptions,
      domain: domain || "Web",
      difficulty: difficulty || "Easy",
      tags,
      expectedDeliverables,
      evaluationCriteria,
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
 */
export async function getAllProblems(req, res, next) {
  try {
    const { tags, domain, difficulty } = req.query;

    const filter = {
      status: "PUBLISHED",
      deletedAt: null
    };

    if (tags) filter.tags = { $in: tags.split(",").map(t => t.trim()) };
    if (domain) filter.domain = domain;
    if (difficulty) filter.difficulty = difficulty;

    const problems = await Problem.find(filter)
      .select("title slug summary domain difficulty tags createdAt")
      .sort({ createdAt: -1 });

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

    // Regenerate slug if title changes
    if (req.body.title && req.body.title !== problem.title) {
      problem.slug = await generateUniqueSlug(req.body.title);
    }

    Object.assign(problem, req.body);
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

    if (problem.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    problem.deletedAt = new Date();
    problem.status = "DRAFT"; // reset to draft on delete
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

    if (problem.status !== "DRAFT") {
      return res.status(400).json({ message: "Only draft problems can be submitted for review" });
    }

    problem.status = "PENDING_REVIEW";
    await problem.save();

    res.json(problem);
  } catch (err) {
    next(err);
  }
}

/**
 * Get all problems created by the logged-in user
 * Returns all statuses; filtering/sorting can be done in frontend
 */
export async function getMyProblems(req, res, next) {
  try {
    const problems = await Problem.find({ createdBy: req.user.id, deletedAt: null })
      .sort({ createdAt: -1 }); // newest first

    res.json(problems);
  } catch (err) {
    next(err);
  }
}
