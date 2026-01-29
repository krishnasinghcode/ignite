import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { SolutionAPI } from "@/api/solutions";
import { SavedProblemAPI } from "@/api/savedProblems";

import ProblemPresenter from "@/components/problems/ProblemPresenter";
import SolutionCard from "@/components/solutions/SolutionCard";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  Users,
  Bookmark,
  BookmarkCheck
} from "lucide-react";

export default function ProblemDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProblemAndSolutions = async () => {
      setLoading(true);
      try {
        const resProblem = await ProblemAPI.getProblemBySlug(slug);
        setProblem(resProblem);

        if (resProblem?.status === "PUBLISHED") {
          const resSolutions =
            await SolutionAPI.getSolutionsByProblem(resProblem._id);
          setSolutions(resSolutions);
        }

        // Check saved state (ignore if guest)
        if (resProblem?._id) {
          try {
            const resSaved = await SavedProblemAPI.isSaved(resProblem._id);
            setIsSaved(resSaved.saved);
          } catch {
            // guest user → ignore
          }
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemAndSolutions();
  }, [slug]);

  const handleToggleSave = async () => {
    if (!problem) return;

    try {
      setSaving(true);
      const res = await SavedProblemAPI.toggleSave(problem._id);
      setIsSaved(res.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpvote = async (solutionId) => {
    try {
      const res = await SolutionAPI.toggleUpvote(solutionId);
      setSolutions((prev) =>
        prev.map((s) =>
          s._id === solutionId
            ? {
                ...s,
                hasLiked: res.upvoted,
                upvoteCount: res.upvoted
                  ? s.upvoteCount + 1
                  : s.upvoteCount - 1
              }
            : s
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!problem) {
    return (
      <p className="text-center py-20 text-muted-foreground">
        Problem not found
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Navigation + Actions */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={handleToggleSave}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4 mr-2" />
            )}
            {isSaved ? "Saved" : "Save"}
          </Button>

          <Button
            onClick={() =>
              navigate(`/problems/${problem.slug}/submit`)
            }
          >
            Submit Solution
          </Button>
        </div>
      </div>

      {/* Problem Content */}
      <ProblemPresenter problem={problem} showContent={true} />

      <Separator />

      {/* Solutions */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Community Solutions</h2>
          <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-medium">
            {solutions.length}
          </span>
        </div>

        {solutions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
            <Users className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-2 text-muted-foreground">
              Be the first to solve this!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {solutions.map((sol) => (
              <SolutionCard
                key={sol._id}
                sol={sol}
                onUpvote={() => handleUpvote(sol._id)}
                onView={(id) => navigate(`/solutions/${id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
