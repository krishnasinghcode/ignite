import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { SolutionAPI } from "@/api/solutions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProblemDetail() {
  const { slug, id } = useParams(); // slug → public, id → preview
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemAndSolutions = async () => {
      setLoading(true);
      try {
        const resProblem = id
          ? await ProblemAPI.getProblemById(id)       // preview (any status)
          : await ProblemAPI.getProblemBySlug(slug);  // public (published only)

        setProblem(resProblem);

        if (resProblem.status === "PUBLISHED") {
          const resSolutions =
            await SolutionAPI.getSolutionsByProblem(resProblem._id);
          setSolutions(resSolutions);
        } else {
          setSolutions([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemAndSolutions();
  }, [slug, id]);

  if (loading)
    return (
      <p className="text-center text-sm text-muted-foreground">Loading...</p>
    );

  if (!problem)
    return (
      <p className="text-center text-sm text-muted-foreground">
        Problem not found
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Problem Details */}
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold line-clamp-2">
            {problem.title}
          </CardTitle>

          {problem.status !== "PUBLISHED" && (
            <Badge variant="destructive" className="w-fit">
              Preview — {problem.status}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {problem.summary}
          </p>

          <p className="text-base whitespace-pre-line">
            {problem.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{problem.domain}</Badge>
            <Badge variant="secondary">{problem.difficulty}</Badge>

            {problem.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {problem.status === "PUBLISHED" && (
            <Button
              onClick={() => navigate(`/problems/${problem.slug}/submit`)}
              className="w-full mt-4"
            >
              Submit Your Solution
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Community Solutions */}
      {problem.status === "PUBLISHED" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Community Solutions</h2>

          {solutions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No solutions yet. Be the first to submit!
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {solutions.map((sol) => (
                <Card
                  key={sol._id}
                  className="hover:shadow-md transition"
                >
                  <CardHeader>
                    <CardTitle className="text-base">
                      {sol.userId?.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    {sol.techStack?.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Tech Stack: {sol.techStack.join(", ")}
                      </p>
                    )}

                    <p className="text-sm text-gray-700 line-clamp-4">
                      {typeof sol.writeup === "string"
                        ? sol.writeup
                        : JSON.stringify(sol.writeup)}
                    </p>

                    <div className="flex flex-col gap-2 mt-2">
                      {sol.repositoryUrl && (
                        <a
                          href={sol.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Repository
                        </a>
                      )}

                      <Button
                        variant="link"
                        onClick={() =>
                          navigate(`/solutions/${sol._id}`)
                        }
                      >
                        View Full Solution →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
