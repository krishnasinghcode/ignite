import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolutionAPI } from "@/api/solutions";
import SolutionForm from "@/components/solutions/SolutionForm";

export default function EditSolution() {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    SolutionAPI.getSolutionById(solutionId)
      .then(setSolution)
      .catch(() => setError("Solution not found or access denied"));
  }, [solutionId]);

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await SolutionAPI.updateSolution(solutionId, data);
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!solution) return <p>Loading...</p>;

  const locked = ["UNDER_REVIEW", "APPROVED"].includes(solution.status);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Your Solution</h1>

      {locked ? (
        <div className="alert alert-warning">
          This solution is {solution.status.toLowerCase()} and cannot be edited.
        </div>
      ) : (
        <SolutionForm
          initialData={solution}
          onSubmit={handleUpdate}
          loading={loading}
        />
      )}
    </div>
  );
}
