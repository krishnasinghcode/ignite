import { AuthAPI } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AuthAPI.logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
