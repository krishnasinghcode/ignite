import { useEffect, useState } from "react";
import { ProblemAPI } from "@/api/problems";
import { Link } from "react-router-dom";

export default function MyProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    try {
      const data = await ProblemAPI.getMyProblems();

      // Sort by status: DRAFT -> PENDING_REVIEW -> others
      const statusOrder = ["DRAFT", "PENDING_REVIEW", "APPROVED", "PUBLISHED", "REJECTED"];
      const sorted = data.sort((a, b) => {
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      });

      setProblems(sorted);
    } catch (err) {
      console.error(err);
      alert("Failed to load your problems");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async (problemId) => {
    try {
      await ProblemAPI.submitProblemForReview(problemId);
      alert("Problem submitted for review");
      fetchProblems(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to submit problem");
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Problems</h1>
        <Link to="/problems/create" className="btn btn-primary">
          Create Problem
        </Link>
      </div>

      {problems.length === 0 ? (
        <p>No problems yet. Start by creating one!</p>
      ) : (
        <div className="space-y-3">
          {problems.map((p) => (
            <div
              key={p._id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{p.title}</h2>
                <p className="text-sm text-gray-500">
                  Status: {p.status} | Domain: {p.domain} | Difficulty: {p.difficulty}
                </p>
              </div>
              <div className="flex items-center">
                {p.status === "DRAFT" && (
                  <button
                    onClick={() => handleSubmitForReview(p._id)}
                    className="btn btn-sm btn-success"
                  >
                    Submit for Review
                  </button>
                )}
                <Link
                  to={`/problems/edit/${p._id}`}
                  className="btn btn-sm btn-outline ml-2"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
