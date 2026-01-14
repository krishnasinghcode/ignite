// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import API from "@/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );
  const [loading, setLoading] = useState(true);

  // On initial load, try to refresh token if accessToken exists
  useEffect(() => {
    const refreshOnLoad = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/refresh-token"); // Axios handles cookie automatically
        const { accessToken: newToken, user: userData } = res.data;

        localStorage.setItem("accessToken", newToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setAccessToken(newToken);
        setUser(userData);
      } catch (err) {
        console.log("Token refresh failed", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    refreshOnLoad();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setAccessToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
