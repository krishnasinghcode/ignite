import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { UserAPI } from "@/api/user";
import { Button } from "@/components/ui/button";

export default function UserProfile() {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1. Fetch basic user info
        const userData = userId 
          ? await UserAPI.getUserById(userId)  // endpoint for any user
          : await UserAPI.getMe();             // endpoint for self

        // 2. Fetch stats
        const statsData = userId
          ? await UserAPI.getUserStats(userId) // endpoint for stats of specific user
          : await UserAPI.getMyStats();        // stats for self

        setUserInfo(userData);
        setStats(statsData);
      } catch (err) {
        console.error("Error fetching profile or stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!userInfo) return <div>User not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{userInfo.name}</h1>
      <p className="text-muted-foreground">{userInfo.email}</p>

      {/* Stats */}
      {stats && (
        <div className="flex gap-4 mt-4">
          <div className="p-4 border rounded-lg shadow-sm bg-card">
            <p className="font-bold text-lg">{stats.problemsCreatedCount || 0}</p>
            <p className="text-sm text-muted-foreground">Problems Created</p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm bg-card">
            <p className="font-bold text-lg">{stats.solutionsSubmittedCount || 0}</p>
            <p className="text-sm text-muted-foreground">Solutions Submitted</p>
          </div>
        </div>
      )}

      <Button asChild variant="outline">
        <Link to={`/users/${userInfo._id}/solutions`}>View Solutions</Link>
      </Button>
    </div>
  );
}
