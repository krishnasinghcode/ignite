import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";
import { useAuth } from "@/context/AuthContext"; // Import Auth
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UserProfile() {
  const { userId } = useParams();
  const { user } = useAuth(); // Get current logged-in user
  const [solutions, setSolutions] = useState([]);
  
  // Check if this is the user's own profile
  const isOwnProfile = user?._id === userId;

  useEffect(() => {
    SolutionAPI.getSolutionsByUser(userId).then(setSolutions);
  }, [userId]);

  const getStatusVariant = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "destructive";
    return "secondary";
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{isOwnProfile ? "My Solutions" : "Public Solutions"}</h1>

      {solutions.length === 0 ? (
        <p className="text-muted-foreground">No solutions found.</p>
      ) : (
        <div className="grid gap-4">
          {solutions.map((sol) => (
            <div key={sol._id} className="border p-4 rounded-lg shadow-sm flex items-center justify-between bg-card">
              <div className="space-y-1">
                <p className="font-bold text-lg">{sol.problemId?.title}</p>
                <div className="flex gap-2 items-center">
                   <Badge variant={getStatusVariant(sol.status)}>{sol.status}</Badge>
                   <span className="text-xs text-muted-foreground">
                     Submitted on {new Date(sol.createdAt).toLocaleDateString()}
                   </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" asChild size="sm">
                  <Link to={`/solutions/${sol._id}`}>View</Link>
                </Button>

                {/* Show Edit button only if it's their profile AND status allows editing */}
                {isOwnProfile && !["APPROVED", "UNDER_REVIEW"].includes(sol.status) && (
                  <Button variant="default" asChild size="sm">
                    <Link to={`/solutions/edit/${sol._id}`}>Edit</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
