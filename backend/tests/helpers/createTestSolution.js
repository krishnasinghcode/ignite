import Solution from "../../src/models/solutionModel";

export async function createTestSolution({ userId, problemId }) {
  if (!userId || !problemId) {
    throw new Error("createTestSolution requires userId and problemId");
  }

  const solution = await Solution.create({
    userId,
    problemId,
    repositoryUrl: "https://github.com/x",
    status: "SUBMITTED",
    content: `
## Understanding
This problem requires designing a scalable cache.

## Approach
Used Redis with consistent hashing.

## Tradeoffs
- Memory usage vs latency
    `,
  });

  return solution;
}
