import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { SolutionAPI } from "@/api/solutions";

export default function ProblemDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemAndSolutions = async () => {
      setLoading(true);
      try {
        // Fetch the problem by slug
        const resProblem = await ProblemAPI.getProblemBySlug(slug);
        setProblem(resProblem);

        // Fetch public solutions for this problem
        const resSolutions = await SolutionAPI.getSolutionsByProblem(resProblem._id);
        setSolutions(resSolutions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemAndSolutions();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!problem) return <p>Problem not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Problem Details */}
      <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
      <p className="mb-2">{problem.summary}</p>
      <p className="mb-4">{problem.description}</p>

      <div className="flex gap-2 mb-4">
        <span className="badge">{problem.domain}</span>
        <span className="badge">{problem.difficulty}</span>
        {problem.tags.map(tag => (
          <span key={tag} className="badge badge-secondary">{tag}</span>
        ))}
      </div>

      {/* Submit Solution CTA */}
      <button
        onClick={() => navigate(`/problems/${slug}/submit`)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
      >
        Submit Your Solution
      </button>

      {/* Public Solutions */}
      <h2 className="text-xl font-semibold mb-2">Community Solutions</h2>
      {solutions.length === 0 ? (
        <p>No solutions yet. Be the first to submit!</p>
      ) : (
        <ul>
          {solutions.map(sol => (
            <li key={sol._id} className="border p-3 mb-3 rounded">
              <p className="font-semibold">{sol.userId.name}</p>
              {sol.techStack.length > 0 && (
                <p className="text-sm text-gray-600">Tech Stack: {sol.techStack.join(", ")}</p>
              )}

              {/* Simplest fix: render writeup as JSON string */}
              <p className="mt-2">{JSON.stringify(sol.writeup)}</p>
              <div className="flex">
                {sol.repositoryUrl && (
                  <a
                    href={sol.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline mt-2 block"
                  >
                    View Repository
                  </a>
                )}
                <button
                  onClick={() => navigate(`/solutions/${sol._id}`)}
                  className="text-blue-600 underline mt-2"
                >
                  View Full Solution →
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
