import api from "./axios";

export const MetadataAPI = {
  getAll: async () => {
    const res = await api.get("/metadata");
    return res.data;
  },

  getByType: async (type) => {
    const res = await api.get(`/metadata?type=${type}`);
    return res.data;
  },

  create: async (payload) => {
    const res = await api.post("/metadata", payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/metadata/${id}`);
    return res.data;
  },
};
