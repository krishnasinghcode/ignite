import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { SolutionAPI } from "@/api/solutions";

import ProblemPresenter from "@/components/problems/ProblemPresenter";
import SolutionCard from "@/components/solutions/SolutionCard";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ProblemDetail() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemAndSolutions = async () => {
      setLoading(true);
      try {
        const resProblem = id ? await ProblemAPI.getProblemById(id) : await ProblemAPI.getProblemBySlug(slug);
        setProblem(resProblem);

        if (resProblem.status === "PUBLISHED") {
          const resSolutions = await SolutionAPI.getSolutionsByProblem(resProblem._id);
          setSolutions(resSolutions);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemAndSolutions();
  }, [slug, id]);

  const handleUpvote = async (solutionId) => {
    try {
      const res = await SolutionAPI.toggleUpvote(solutionId);
      setSolutions((prev) => prev.map((s) => 
        s._id === solutionId ? { ...s, hasLiked: res.upvoted, upvoteCount: res.upvoted ? s.upvoteCount + 1 : s.upvoteCount - 1 } : s
      ));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!problem) return <p className="text-center py-20 text-muted-foreground">Problem not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* 1. Navigation & Actions */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={() => navigate(`/problems/${problem.slug}/submit`)}>
          Submit Solution
        </Button>
      </div>

      {/* 2. Main Problem Content */}
      <ProblemPresenter problem={problem} showContent={true} />

      <Separator />

      {/* 3. Solutions Section */}
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
            <p className="mt-2 text-muted-foreground">Be the first to solve this!</p>
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