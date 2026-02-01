import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3000/api
  withCredentials: true,
});

// 1. ATTACH TOKEN RIGHT BEFORE REQUEST SENDS
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Check status 401 and ensure we aren't already retrying
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // Use the base URL properly
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Update the failed request and the main instance
        API.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (err) {
        // Refresh token failed -> clear everything
        localStorage.removeItem("accessToken");
        // Only redirect if we are not already on the login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
