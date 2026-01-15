import { createContext, useContext, useState, useEffect } from "react";
import API from "@/api/axios";

/* ---------------- helpers ---------------- */

const safeParse = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const getStoredToken = () => {
  const token = localStorage.getItem("accessToken");
  return token && token !== "undefined" ? token : null;
};

/* ---------------- context ---------------- */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(getStoredToken);
  const [user, setUser] = useState(() => safeParse("user"));
  const [loading, setLoading] = useState(true);

  /* -------- refresh on initial load -------- */

  useEffect(() => {
    const refreshOnLoad = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/refresh-token");
        const { accessToken: newToken, user: userData } = res.data;

        localStorage.setItem("accessToken", newToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setAccessToken(newToken);
        setUser(userData);
      } catch (err) {
        console.error("Token refresh failed", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    refreshOnLoad();
  }, [accessToken]);

  /* ---------------- actions ---------------- */

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

  /* ---------------- provider ---------------- */

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
