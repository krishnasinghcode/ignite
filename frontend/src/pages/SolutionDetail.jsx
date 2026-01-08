import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";

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

  if (loading) return <p>Loading...</p>;
  if (!solution) return <p>Solution not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold">{solution.problemId.title}</h1>
      <p className="text-sm text-gray-500">by {solution.userId.name}</p>

      <h2 className="mt-4 font-semibold">Understanding</h2>
      <p>{solution.writeup.understanding}</p>

      <h2 className="mt-4 font-semibold">Approach</h2>
      <p>{solution.writeup.approach}</p>

      <h2 className="mt-4 font-semibold">Architecture</h2>
      <p>{solution.writeup.architecture}</p>

      <h2 className="mt-4 font-semibold">Trade-offs</h2>
      <p>{solution.writeup.tradeoffs}</p>

      <h2 className="mt-4 font-semibold">Limitations</h2>
      <p>{solution.writeup.limitations}</p>

      <h2 className="mt-4 font-semibold">Outcome</h2>
      <p>{solution.writeup.outcome}</p>

      <a
        href={solution.repositoryUrl}
        target="_blank"
        className="text-blue-600 underline mt-4 block"
      >
        View Repository
      </a>
    </div>
  );
}
