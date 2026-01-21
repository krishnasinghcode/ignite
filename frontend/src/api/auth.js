import api from "./axios";

// ============================================================
// ----------------- AUTH -----------------
// ============================================================
export const AuthAPI = {
  // Login
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  // Google OAuth login
googleLogin: async (credential) => {
  const res = await api.post("/auth/google", { credential });
  return res.data;
},


  // Signup (after OTP verification)
  signup: async (name, email, password, otp) => {
    const res = await api.post("/auth/signup", {
      name,
      email,
      password,
      otp,
    });
    return res.data;
  },

  // Logout
  logout: async () => {
    const res = await api.post(
      "/auth/logout",
      {},
      { withCredentials: true }
    );
    return res.data;
  },
  
  // Refresh access token
  refreshToken: async () => {
    const res = await api.get("/auth/refresh-token", {
      withCredentials: true,
    });
    return res.data;
  },

  // ============================================================
  // ----------------- OTP / SIGNUP -----------------
  // ============================================================

  // Send signup OTP
  sendSignupOtp: async (email) => {
    const res = await api.post("/auth/send-otp", { email });
    return res.data;
  },

  // Verify OTP and signup
  verifySignup: async (name, email, password, otp) => {
    const res = await api.post("/auth/verify-signup", {
      name,
      email,
      password,
      otp,
    });
    return res.data;
  },

  // ============================================================
  // ----------------- PASSWORD RESET -----------------
  // ============================================================

  // Send reset OTP
  sendResetOtp: async (email) => {
    const res = await api.post("/auth/reset-otp", { email });
    return res.data;
  },

  // Verify reset OTP
  verifyResetOtp: async (email, otp) => {
    const res = await api.post("/auth/verify-reset-otp", {
      email,
      otp,
    });
    return res.data;
  },

  // Reset password
  resetPassword: async (email, newPassword, confirmPassword) => {
    const res = await api.post("/auth/reset-password", {
      email,
      newPassword,
      confirmPassword,
    });
    return res.data;
  },
};
