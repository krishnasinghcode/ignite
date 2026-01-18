import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { SolutionAPI } from "@/api/solutions";
import SolutionForm from "@/components/solutions/SolutionForm"; // Import the new reusable form

export default function SubmitSolution() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    ProblemAPI.getProblemBySlug(slug)
      .then(setProblem)
      .catch(() => setError("Could not load problem details."));
  }, [slug]);

  const handleSubmit = async (formattedData) => {
    if (!problem?._id) return; // Guard clause
    setLoading(true);
    try {
      await SolutionAPI.submitSolution({
        problemId: problem._id,
        ...formattedData
      });
      navigate(`/problems/${slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit solution.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!problem) return <p className="p-4">Loading problem context...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Submit Solution</h1>
        <p className="text-gray-600">Problem: <span className="font-medium text-primary">{problem.title}</span></p>
      </div>

      {/* Use the reusable form component */}
      <SolutionForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}