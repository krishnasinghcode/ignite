import Problem from "../../src/models/problemModel";

export async function createTestProblem({ createdBy }) {
  if (!createdBy) {
    throw new Error("createTestProblem requires createdBy");
  }

  const problem = await Problem.create({
    title: "Cache Design",
    slug: "cache-design",
    summary: "Design cache",

    content: `
## Context
Design an in-memory and distributed cache.

## Constraints
- Low latency
- High availability
`,

    category: "SYSTEMS",
    problemType: "PROJECT",
    difficulty: "MEDIUM",

    createdBy,
    status: "PUBLISHED",
  });

  return problem;
}
