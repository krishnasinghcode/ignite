import Problem from "../models/problemModel.js";
import { generateUniqueSlug } from "../services/slug.js";

export async function createProblem(req, res, next) {
  try {
    const {
      title,
      summary,
      description,
      domain,
      difficulty,
      tags
    } = req.body;

    const slug = await generateUniqueSlug(title);

    const problem = await Problem.create({
      title,
      slug,
      summary,
      description,
      domain,
      difficulty,
      tags,
      createdBy: req.user.id
    });

    res.status(201).json(problem);
  } catch (err) {
    next(err);
  }
}

export async function getAllProblems(req, res, next) {
  try {
    const { tags, domain, difficulty } = req.query;

    const filter = { status: "published" };

    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }

    if (domain) {
      filter.domain = domain;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const problems = await Problem.find(filter)
      .select("title slug summary domain difficulty tags")
      .sort({ createdAt: -1 });

    res.json(problems);
  } catch (err) {
    next(err);
  }
}

export async function getProblemBySlug(req, res, next) {
  try {
    const problem = await Problem.findOne({
      slug: req.params.slug,
      status: "published"
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    next(err);
  }
}

export async function publishProblem(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // optional: only creator or admin
    if (problem.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    problem.status = "published";
    await problem.save();

    res.json({ message: "Problem published successfully" });
  } catch (err) {
    next(err);
  }
}
