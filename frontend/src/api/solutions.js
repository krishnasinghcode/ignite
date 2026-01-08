import api from "./axios";

export const SolutionAPI = {
  // Submit a solution (POST body)
  submitSolution: async (payload) => {
    const res = await api.post("/solutions", payload);
    return res.data;
  },

  // Get all public solutions submitted by a specific user
  getSolutionsByUser: async (userId) => {
    const res = await api.get(`/solutions/user/${userId}`);
    return res.data;
  },

  // Get all public solutions for a specific problem
  getSolutionsByProblem: async (problemId) => {
    const res = await api.get(`/solutions/problem/${problemId}`);
    return res.data;
  },

  // Optional: Toggle solution visibility (owner only)
  toggleVisibility: async (solutionId) => {
    const res = await api.patch(`/solutions/${solutionId}/toggle-visibility`);
    return res.data;
  },

  // Get a specific solution for an problem
  getSolutionById: async (solutionId) => {
    const res = await api.get(`/solutions/${solutionId}`);
    return res.data;
  }
};
