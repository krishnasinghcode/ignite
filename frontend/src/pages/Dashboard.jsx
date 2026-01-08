import { useState, useEffect } from "react";
import { AuthAPI } from "../api/auth";
import Logout from "../components/auth/Logout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await AuthAPI.profile();
        setUser(res);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div>{user.name}</div>
      <div>{user.email}</div>
      <Button className="border border-b-green-700"
      onClick={()=>{navigate(`/users/${user.id}`)}}>your solutions</Button>
      <Logout />
    </div>
  );
}
