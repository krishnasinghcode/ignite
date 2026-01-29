// src/utils/problemRoutes.js

export const PROBLEM_VIEW_CONTEXT = {
  PUBLIC_LIST: "PUBLIC_LIST",
  MY_CREATED: "MY_CREATED",
};

export function resolveProblemRoute(problem, context) {
  if (!problem) {
    throw new Error("Problem is required");
  }

  switch (context) {
    case PROBLEM_VIEW_CONTEXT.PUBLIC_LIST:
      return `/problems/${problem.slug}`;

    case PROBLEM_VIEW_CONTEXT.MY_CREATED:
      return problem.status === "PUBLISHED"
        ? `/problems/${problem.slug}`
        : `/problems/${problem._id}/preview`;

    default:
      throw new Error(`Unknown problem view context: ${context}`);
  }
}
