import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function SolutionCard({ sol, onUpvote, onView, showEdit = false, showStatusTag = false }) {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    setIsLiking(true);
    await onUpvote(sol._id);
    setIsLiking(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case "SUBMITTED":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "UNDER_REVIEW":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default:
        return "bg-gray-200 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card className="hover:border-primary/50 transition-colors group overflow-hidden relative">
      {/* Render badge only if showStatusTag is true */}
      {showStatusTag && (
        <div className="absolute top-2 right-2 z-10 max-w-[90%]">
          <Badge
            className={`shadow-sm truncate w-full text-xs ${getStatusColor(sol.status)}`}
            variant="outline"
          >
            {sol.status.replace("_", " ")}
          </Badge>
        </div>
      )}

      <CardContent className="p-0 flex items-stretch">
        {/* Upvote Section */}
        <div className="bg-secondary/20 w-14 flex flex-col items-center justify-center gap-1 border-r">
          <Button
            variant="ghost"
            size="sm"
            className={`h-9 w-9 p-0 hover:bg-rose-500/10 ${sol.hasLiked ? "text-rose-500" : "text-muted-foreground"}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`h-5 w-5 ${sol.hasLiked ? "fill-current" : ""}`} />
          </Button>
          <span className="text-xs font-bold">{sol.upvoteCount || 0}</span>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 w-full">
            <h4 className="font-bold text-lg leading-none truncate">{sol.userId?.name || "Anonymous"}</h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sol.techStack?.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-[9px] px-1.5 py-0 truncate">
                  {tech}
                </Badge>
              ))}
              {sol.techStack?.length > 3 && (
                <span className="text-[10px] text-muted-foreground truncate">
                  +{sol.techStack.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto justify-end">
            {showEdit && (
              <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                <Link to={`/solutions/edit/${sol._id}`}>Edit Submission</Link>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onView(sol._id)}>
              View Writeup
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}