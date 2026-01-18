import api from "./axios";

export const AdminSolutionAPI = {
  // Get all solutions in the system (for the Admin List view)
  // Supports optional filtering, e.g., getAllSolutions({ status: 'SUBMITTED' })
  getAllSolutions: async (params = {}) => {
    const res = await api.get("/admin/solutions", { params });
    return res.data;
  },

  // Get full details of a solution (including non-public ones)
  getSolutionById: async (solutionId) => {
    const res = await api.get(`/admin/solutions/${solutionId}`);
    return res.data;
  },

  // Move status from SUBMITTED to UNDER_REVIEW
  startReview: async (solutionId) => {
    const res = await api.patch(`/admin/solutions/${solutionId}/start-review`);
    return res.data;
  },

  // Finalize review: Approve or Reject
  // payload: { decision: 'APPROVE' | 'REJECT', rejectionReason?: string }
  reviewSolution: async (solutionId, payload) => {
    const res = await api.patch(`/admin/solutions/${solutionId}/review`, payload);
    return res.data;
  }
};