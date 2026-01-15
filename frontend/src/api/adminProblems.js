import api from "./axios";

export const AdminProblemAPI = {
  getAllProblems: async () => {
    const res = await api.get("/admin/problems");
    return res.data;
  },

  getProblemById: async (problemId) => {
    const res = await api.get(`/admin/problems/${problemId}`);
    console.log(res.data);
    return res.data;
  },

  reviewProblem: async (problemId, payload) => {
    const res = await api.patch(
      `/admin/problems/${problemId}/review`,
      payload
    );
    return res.data;
  },

  publishProblem: async (problemId) => {
    const res = await api.patch(
      `/admin/problems/${problemId}/publish`
    );
    return res.data;
  },
};
