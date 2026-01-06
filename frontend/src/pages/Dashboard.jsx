import { useState, useEffect } from "react";
import { AuthAPI } from "../api/auth";
import Logout from "../components/auth/Logout";

export default function Dashboard() {
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
      <Logout />
    </div>
  );
}
