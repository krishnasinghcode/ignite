import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

export default function UserSolutions() {
  const { userId: paramUserId } = useParams();
  const { user: loggedInUser } = useAuth();

  // Ensure we have a valid ID to fetch
  const userId = paramUserId || loggedInUser?._id;
  const isOwnProfile = loggedInUser?._id === userId;

  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if we have a userId, otherwise we'll get a 400 error
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

  const getStatusVariant = (status) => {
    switch (status) {
      case "APPROVED": return "default"; // Shadcn typically uses 'default' or 'outline'
      case "REJECTED": return "destructive";
      case "SUBMITTED": return "secondary";
      default: return "outline";
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
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
            <SolutionListItem 
              key={solution._id} 
              solution={solution} 
              isOwnProfile={isOwnProfile} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Sub-component to handle individual list items
 * This allows for local state if you decide to add upvoting here later
 */
function SolutionListItem({ solution, isOwnProfile }) {
  const getStatusVariant = (status) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "REJECTED": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary/30">
      <div className="space-y-2">
        <h3 className="font-bold text-lg leading-tight hover:text-primary transition-colors">
          <Link to={`/solutions/${solution._id}`}>
            {solution.problemId?.title ?? "Untitled Problem"}
          </Link>
        </h3>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Badge */}
          <Badge className={getStatusVariant(solution.status)} variant="outline">
            {solution.status}
          </Badge>

          {/* Upvote Indicator - Highlights rose if the logged-in user has liked it */}
          <div className={`flex items-center gap-1 font-bold text-sm ${solution.hasLiked ? 'text-rose-500' : 'text-muted-foreground'}`}>
            <Heart className={`h-4 w-4 ${solution.hasLiked ? 'fill-current' : ''}`} />
            {solution.upvoteCount || 0}
          </div>

          <span className="text-xs text-muted-foreground">
            {new Date(solution.createdAt).toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1 md:flex-none">
          <Link to={`/solutions/${solution._id}`}>View</Link>
        </Button>
        
        {isOwnProfile && !["APPROVED", "UNDER_REVIEW"].includes(solution.status) && (
          <Button size="sm" asChild className="flex-1 md:flex-none">
            <Link to={`/solutions/edit/${solution._id}`}>Edit</Link>
          </Button>
        )}
      </div>
    </div>
  );
}