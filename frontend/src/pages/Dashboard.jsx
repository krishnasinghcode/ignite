import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logout from "@/components/auth/Logout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div>{user.name}</div>
      <div>{user.email}</div>

      <Button
        className="border border-b-green-700"
        onClick={() => navigate(`/users/${user._id}`)}
      >
        Your Solutions
      </Button>

      <Logout />
    </div>
  );
}
