import api from "./axios";

export const SavedProblemAPI = {
  /**
   * Toggle save / unsave a problem
   * POST /api/problems/:problemId/save
   */
  toggleSave: async (problemId) => {
    const res = await api.post(`/problems/${problemId}/save`);
    return res.data; 
    // { saved: boolean, message: string }
  },

  /**
   * Get all saved problems of logged-in user
   * GET /api/problems/saved
   */
  getMySavedProblems: async () => {
    const res = await api.get("/problems/saved");
    return res.data;
  },

  /**
   * (Optional but recommended)
   * Check if a problem is saved by the logged-in user
   * Useful for initial bookmark state
   */
  isSaved: async (problemId) => {
    const res = await api.get(`/problems/${problemId}/is-saved`);
    return res.data;
    // { saved: boolean }
  }
};
