import { useState } from "react";
import { AuthAPI } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthAPI.login(email, password);
      localStorage.setItem("accessToken", res.accessToken);
      alert("Login successful");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
    <span>OR</span>
    <GoogleLoginButton/>
    </div>
  );
}
