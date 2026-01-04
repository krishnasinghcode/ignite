import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const token = localStorage.getItem("accessToken");
if (token) {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

API.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        API.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] =
          `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
