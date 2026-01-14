import { useState } from "react";
import { AuthAPI } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await AuthAPI.logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setLoading(false);
      navigate("/login");
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
