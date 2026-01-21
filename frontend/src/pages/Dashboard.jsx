import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext";
import Logout from "@/components/auth/Logout";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div>{user.name}</div>
      <div>{user.email}</div>

      <Button onClick={() => navigate("/profile")}>
        My Profile
      </Button>

      <Logout />
    </div>
  );
}
