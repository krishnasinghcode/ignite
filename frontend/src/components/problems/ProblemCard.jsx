import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { SavedProblemAPI } from "@/api/savedProblems";

export default function ProblemCard({ problem, onClick, showEdit = false }) {
  const viewLink = `/problems/${problem.slug}`;

  // Initializing state directly from the problem object provided by the backend
  const [isSaved, setIsSaved] = useState(problem.saved || false);
  const [saving, setSaving] = useState(false);

  // Sync state if the problem prop updates (e.g. after a fresh list fetch)
  useEffect(() => {
    setIsSaved(problem.saved || false);
  }, [problem.saved, problem._id]);

  const handleToggleSave = async (e) => {
    e.stopPropagation(); // Prevents navigating to problem detail when clicking bookmark

    try {
      setSaving(true);
      const res = await SavedProblemAPI.toggleSave(problem._id);
      // The backend returns { saved: boolean }
      setIsSaved(res.saved);
    } catch (err) {
      console.error("Failed to toggle save:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      className="group hover:border-primary/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[10px] border-primary/20 text-primary"
            >
              {problem.category}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {problem.difficulty}
            </Badge>
          </div>

          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {problem.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-1">
            {problem.summary}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Button
            variant="ghost"
            size="icon"
            disabled={saving}
            onClick={handleToggleSave}
            title={isSaved ? "Unsave" : "Save"}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>

          {showEdit && (
            <Button
              asChild
              variant="outline"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Link to={`/problems/edit/${problem._id}`}>Edit</Link>
            </Button>
          )}

          <Button
            asChild
            variant="secondary"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Link to={viewLink}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}