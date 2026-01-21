import api from "./axios";

export const UserAPI = {
  // Basic info for logged-in user
  getMe: async () => {
    const res = await api.get("/users/me");
    return res.data;
  },

  // Stats for logged-in user
  getMyStats: async () => {
    const res = await api.get("/users/me/stats");
    return res.data;
  },

  // --- For viewing other users ---
  getUserById: async (userId) => {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  },

  getUserStats: async (userId) => {
    const res = await api.get(`/users/${userId}/stats`);
    return res.data;
  },
};
