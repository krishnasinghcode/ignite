import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProblemAPI } from "@/api/problems";
import { Button } from "@/components/ui/button";

export default function MyProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    try {
      const data = await ProblemAPI.getMyProblems();

      const statusOrder = [
        "DRAFT",
        "PENDING_REVIEW",
        "APPROVED",
        "PUBLISHED",
        "REJECTED",
      ];

      const sorted = [...data].sort(
        (a, b) =>
          statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
      );

      setProblems(sorted);
    } catch (error) {
      console.error(error);
      alert("Failed to load your problems");
    } finally {
      setLoading(false);
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
        <Button asChild variant="default">
          <Link to="/problems/create">Create Problem</Link>
        </Button>
      </div>

      {problems.length === 0 ? (
        <p>No problems yet. Start by creating one.</p>
      ) : (
        <div className="space-y-3">
          {problems.map((p) => {
            const viewLink =
              p.status === "PUBLISHED"
                ? `/problems/${p.slug}` // public page
                : `/problems/${p._id}/preview`; // owner preview

            return (
              <div
                key={p._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{p.title}</h2>
                  <p className="text-sm text-gray-500">
                    Status: {p.status} · Domain: {p.domain} · Difficulty:{" "}
                    {p.difficulty}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  {/* View → either public or owner preview */}
                  <Button asChild variant="outline" size="sm">
                    <Link to={viewLink}>View</Link>
                  </Button>

                  {/* Edit → only for editable states */}
                  {(p.status === "DRAFT" || p.status === "REJECTED") && (
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/problems/edit/${p._id}`}>Edit</Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
