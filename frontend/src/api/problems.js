import api from "./axios";

export const ProblemAPI = {
  // Create problem (POST body)
  createProblem: async (payload) => {
    const res = await api.post("/problems", payload);
    return res.data;
  },

  // Get all problems with filters (query params)
  getAllProblems: async (params = {}) => {
    const res = await api.get("/problems", { params });
    return res.data;
  },

  // Get single problem by slug (path param)
  getProblemBySlug: async (slug) => {
    const res = await api.get(`/problems/${slug}`);
    return res.data;
  },

  // Publish problem (protected action)
  publishProblem: async (problemId) => {
    const res = await api.patch(`/problems/${problemId}/publish`);
    return res.data;
  }
};
