import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SolutionCard({ 
  sol, 
  onUpvote, 
  onView, 
  showEdit = false, 
  showStatusTag = false 
}) {
  const [isLiking, setIsLiking] = useState(false);

  // Robust like handler to prevent event bubbling and double-clicks
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiking) return;

    try {
      setIsLiking(true);
      await onUpvote(sol._id);
    } catch (err) {
      console.error("Like toggle failed:", err);
    } finally {
      setIsLiking(false);
    }
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
    <Card 
      className="hover:border-primary/50 transition-all group overflow-hidden relative cursor-pointer shadow-sm hover:shadow-md"
      onClick={() => onView(sol._id)}
    >
      {/* Status Badge (Top Right) */}
      {showStatusTag && sol.status && (
        <div className="absolute top-2 right-2 z-10 max-w-[150px]">
          <Badge
            className={cn("shadow-sm truncate w-full text-[10px] px-2 py-0", getStatusColor(sol.status))}
            variant="outline"
          >
            {sol.status.replace("_", " ")}
          </Badge>
        </div>
      )}

      <CardContent className="p-0 flex items-stretch min-h-[100px]">
        {/* SIDEBAR: Upvote Section */}
        <div 
          className="bg-secondary/10 w-14 flex flex-col items-center justify-center gap-1 border-r transition-colors group-hover:bg-secondary/20"
          onClick={(e) => e.stopPropagation()} // Stop bubbling so click doesn't trigger 'onView'
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 w-9 p-0 transition-all active:scale-90",
              sol.hasLiked 
                ? "text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-transform duration-200", 
                sol.hasLiked && "fill-current scale-110"
              )} 
            />
          </Button>
          <span className={cn(
            "text-xs font-bold transition-colors",
            sol.hasLiked ? "text-rose-500" : "text-muted-foreground"
          )}>
            {sol.upvoteCount || 0}
          </span>
        </div>

        {/* MAIN: Content Section */}
        <div className="p-4 flex-1 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1.5 w-full">
            {/* Dynamic Header: Shows Problem Title on Profile, User Name on Problem Page */}
            <h4 className="font-bold text-base md:text-lg leading-tight truncate group-hover:text-primary transition-colors">
              {sol.problemId?.title || sol.userId?.name || "Anonymous Solution"}
            </h4>
            
            {/* Sub-info: If we show Problem Title, also show the author name */}
            {sol.problemId?.title && sol.userId?.name && (
              <p className="text-[11px] text-muted-foreground -mt-1">
                Author: <span className="font-medium">{sol.userId.name}</span>
              </p>
            )}

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sol.techStack?.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-[9px] px-1.5 py-0 leading-normal">
                  {tech}
                </Badge>
              ))}
              {sol.techStack?.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{sol.techStack.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full md:w-auto justify-end">
            {showEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
                asChild 
                onClick={(e) => e.stopPropagation()}
              >
                <Link to={`/solutions/edit/${sol._id}`}>Edit</Link>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs bg-background hover:bg-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onView(sol._id);
              }}
            >
              View Writeup
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}