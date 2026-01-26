import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";

export default function SolutionCard({ sol, onUpvote, onView }) {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    setIsLiking(true);
    await onUpvote(sol._id);
    setIsLiking(false);
  };

  return (
    <Card className="hover:border-primary/50 transition-colors group overflow-hidden">
      <CardContent className="p-0 flex items-stretch">
        {/* Upvote Side Section */}
        <div className="bg-secondary/20 w-14 flex flex-col items-center justify-center gap-1 border-r">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-9 w-9 p-0 hover:bg-rose-500/10 ${sol.hasLiked ? 'text-rose-500' : 'text-muted-foreground'}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`h-5 w-5 ${sol.hasLiked ? 'fill-current' : ''}`} />
          </Button>
          <span className="text-xs font-bold">{sol.upvoteCount || 0}</span>
        </div>

        {/* Content Side Section */}
        <div className="p-5 flex-1 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 w-full">
            <h4 className="font-bold text-lg leading-none">
              {sol.userId?.name || "Anonymous"}
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sol.techStack?.slice(0, 3).map(tech => (
                <Badge key={tech} variant="secondary" className="text-[9px] px-1.5 py-0">
                  {tech}
                </Badge>
              ))}
              {sol.techStack?.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{sol.techStack.length - 3} more</span>
              )}
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => onView(sol._id)} className="w-full md:w-auto">
            View Writeup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}