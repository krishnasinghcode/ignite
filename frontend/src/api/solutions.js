import api from "./axios";

export const SolutionAPI = {
  // Submit a new solution
  submitSolution: async (payload) => {
    const res = await api.post("/solutions", payload);
    return res.data;
  },

  // Update an existing solution
  updateSolution: async (solutionId, payload) => {
    // Change .patch to .put
    const res = await api.put(`/solutions/${solutionId}`, payload);
    return res.data;
  },

  // Get a specific solution by ID (public or owned by user)
  getSolutionById: async (solutionId) => {
    const res = await api.get(`/solutions/${solutionId}`);
    return res.data;
  },

  // Get all solutions for a specific problem (e.g., for a "Leaderboard" or "Community" tab)
  getSolutionsByProblem: async (problemId) => {
    const res = await api.get(`/solutions/problem/${problemId}`);
    return res.data;
  },

  // Get all solutions for a specific user (for their Profile page)
  getSolutionsByUser: async (userId, query = {}) => {
  const res = await api.get(`/solutions/user/${userId}`, { params: query });
  return res.data;
},

  // Delete a solution
  deleteSolution: async (solutionId) => {
    const res = await api.delete(`/solutions/${solutionId}`);
    return res.data;
  },

  // Upvote an solution
  toggleUpvote: async (solutionId) => {
    const res = await api.post(`/solutions/${solutionId}/upvote`);
    return res.data;
  },
};