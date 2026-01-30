import SavedProblem from "../../src/models/savedProblemModel.js";
import { createUser } from "./createUser";
import { createTestProblem } from "./createTestProblem";

export const createTestSavedProblem = async ({ user, problem } = {}) => {
  // If user isn't provided, create one and grab the whole object (including token)
  const userData = user || (await createUser()); 
  const resolvedUser = userData.user;
  const token = userData.token;

  const resolvedProblem =
    problem || (await createTestProblem({ createdBy: resolvedUser._id }));

  const saved = await SavedProblem.create({
    userId: resolvedUser._id,
    problemId: resolvedProblem._id,
  });

  return {
    saved,
    user: resolvedUser,
    token,
    problem: resolvedProblem,
  };
};