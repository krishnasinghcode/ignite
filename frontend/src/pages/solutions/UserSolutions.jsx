import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UserSolutions() {
  const { userId: paramUserId } = useParams(); // param from route if exists
  const { user: loggedInUser } = useAuth();

  // Determine which userId to fetch: route param or current logged-in user
  const userId = paramUserId || loggedInUser?._id;
  const isOwnProfile = loggedInUser?._id === userId;

  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return; // safety check

    let isMounted = true;

    async function fetchSolutions() {
      try {
        const data = await SolutionAPI.getSolutionsByUser(userId);
        if (isMounted) setSolutions(data);
      } catch (err) {
        console.error("Failed to fetch solutions", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSolutions();
    return () => (isMounted = false);
  }, [userId]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-muted-foreground">
        Loading solutions…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isOwnProfile ? "My Solutions" : "User Solutions"}
        </h1>

        {isOwnProfile && (
          <Button variant="outline" asChild>
            <Link to="/users/profile">Back to Profile</Link>
          </Button>
        )}
      </div>

      {/* Empty State */}
      {solutions.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          No solutions submitted yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {solutions.map((solution) => (
            <div
              key={solution._id}
              className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between"
            >
              {/* Left */}
              <div className="space-y-1">
                <h3 className="font-medium text-base">
                  {solution.problemId?.title ?? "Untitled Problem"}
                </h3>

                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(solution.status)}>
                    {solution.status}
                  </Badge>

                  <span className="text-xs text-muted-foreground">
                    Submitted on{" "}
                    {new Date(solution.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/solutions/${solution._id}`}>View</Link>
                </Button>

                {isOwnProfile &&
                  !["APPROVED", "UNDER_REVIEW"].includes(solution.status) && (
                    <Button size="sm" asChild>
                      <Link to={`/solutions/edit/${solution._id}`}>Edit</Link>
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
