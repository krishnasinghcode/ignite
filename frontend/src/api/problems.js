import api from "./axios";

export const ProblemAPI = {
  // Create problem
  createProblem: async (payload) => {
    const res = await api.post("/problems", payload);
    return res.data;
  },

  // Get all problems with filters
  getAllProblems: async (params = {}) => {
    const res = await api.get("/problems", { params });
    return res.data;
  },

  // Get single problem by slug (public)
  getProblemBySlug: async (slug) => {
    const res = await api.get(`/problems/${slug}`);
    return res.data;
  },

  // Get problem by ID (owner-only preview)
  getProblemById: async (id) => {
    const res = await api.get(`/problems/by-id/${id}`);
    console.log(res.data);
    return res.data;
  },

  // Publish problem
  publishProblem: async (problemId) => {
    const res = await api.patch(`/problems/${problemId}/publish`);
    return res.data;
  },

  // Get all problems of logged-in user
  getMyProblems: async () => {
    const res = await api.get("/problems/my");
    return res.data;
  },

  // Submit a problem for review
  submitProblemForReview: async (problemId) => {
    const res = await api.patch(`/problems/${problemId}/submit-review`);
    return res.data;
  },
};
