import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import your reusable SolutionCard
import SolutionCard from "@/components/solutions/SolutionCard";

export default function UserSolutions() {
  const { userId: paramUserId } = useParams();
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();

  const userId = paramUserId || loggedInUser?._id;
  const isOwnProfile = loggedInUser?._id === userId;

  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchSolutions() {
      try {
        setLoading(true);
        const data = await SolutionAPI.getSolutionsByUser(userId);
        setSolutions(data);
      } catch (err) {
        console.error("Failed to fetch solutions", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSolutions();
  }, [userId]);

  // Shared Upvote Handler
  const handleUpvote = async (solutionId) => {
    try {
      const res = await SolutionAPI.toggleUpvote(solutionId);
      setSolutions((prev) =>
        prev.map((s) =>
          s._id === solutionId
            ? { 
                ...s, 
                hasLiked: res.upvoted, 
                upvoteCount: res.upvoted ? (s.upvoteCount || 0) + 1 : (s.upvoteCount || 0) - 1 
              }
            : s
        )
      );
    } catch (err) {
      console.error("Upvote failed", err);
    }
  };

  // Logic for status badge colors (Can also be moved into SolutionCard)
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "REJECTED": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default: return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {isOwnProfile ? "My Solutions" : "User Solutions"}
        </h1>
        {isOwnProfile && (
          <Button variant="outline" asChild size="sm">
            <Link to="/users/profile">Back to Profile</Link>
          </Button>
        )}
      </div>

      {solutions.length === 0 ? (
        <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-xl">
          No solutions submitted yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {solutions.map((solution) => (
            <div key={solution._id} className="relative group">
              {/* Status Ribbon (Since these are user-specific, status matters) */}
              <Badge 
                className={`absolute -top-2 -right-2 z-10 shadow-sm ${getStatusColor(solution.status)}`}
                variant="outline"
              >
                {solution.status}
              </Badge>

              <SolutionCard 
                sol={{
                  ...solution,
                  // Use the problem title if available, otherwise fallback
                  userId: { name: solution.problemId?.title || "Untitled Problem" }
                }} 
                onUpvote={() => handleUpvote(solution._id)}
                onView={(id) => navigate(`/solutions/${id}`)}
              />

              {/* Extra Edit Button for own profile */}
              {isOwnProfile && !["APPROVED", "UNDER_REVIEW"].includes(solution.status) && (
                <div className="absolute bottom-3 right-40 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="ghost" size="xs" asChild className="h-7 text-[10px]">
                    <Link to={`/solutions/edit/${solution._id}`}>Edit Submission</Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}