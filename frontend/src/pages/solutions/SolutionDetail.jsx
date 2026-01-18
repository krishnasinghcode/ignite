import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SolutionDetail() {
  const { solutionId } = useParams();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const res = await SolutionAPI.getSolutionById(solutionId);
        setSolution(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolution();
  }, [solutionId]);

  if (loading) return <p className="text-center text-sm text-muted-foreground">Loading...</p>;
  if (!solution) return <p className="text-center text-sm text-muted-foreground">Solution not found</p>;

  const sections = [
    { title: "Understanding", content: solution.writeup.understanding },
    { title: "Approach", content: solution.writeup.approach },
    { title: "Architecture", content: solution.writeup.architecture },
    { title: "Trade-offs", content: solution.writeup.tradeoffs },
    { title: "Limitations", content: solution.writeup.limitations },
    { title: "Outcome", content: solution.writeup.outcome }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{solution.problemId.title}</h1>
        <p className="text-sm text-muted-foreground">by {solution.userId.name}</p>
        {solution.techStack && solution.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {solution.techStack.map((tech) => (
              <Badge key={tech} variant="outline">{tech}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Writeup Sections */}
      <div className="space-y-6">
        {sections.map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="whitespace-pre-line text-gray-700">{content || "N/A"}</p>
          </div>
        ))}
      </div>

      {/* Repository Link */}
      {solution.repositoryUrl && (
        <Button asChild className="w-full mt-4">
          <a href={solution.repositoryUrl} target="_blank" rel="noopener noreferrer">
            View Repository
          </a>
        </Button>
      )}
    </div>
  );
}
