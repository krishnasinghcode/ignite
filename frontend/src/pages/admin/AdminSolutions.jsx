import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSolutionAPI } from "@/api/adminSolutions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AdminSolutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AdminSolutionAPI.getAllSolutions()
      .then(setSolutions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusVariant = (status) => {
    const variants = {
      SUBMITTED: "warning",
      UNDER_REVIEW: "info",
      APPROVED: "success",
      REJECTED: "destructive",
    };
    return variants[status] || "outline";
  };

  if (loading) return <div className="p-6">Loading submissions...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin · Solution Review</h1>

      {solutions.map((sol) => (
        <Card
          key={sol._id}
          className="p-4 cursor-pointer hover:bg-muted transition"
          onClick={() => navigate(`/admin/solutions/${sol._id}`)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{sol.problemId?.title}</h2>
              <p className="text-sm text-muted-foreground">
                Submitted by <span className="text-foreground">{sol.userId?.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {new Date(sol.createdAt).toLocaleDateString()}
              </span>
              <Badge variant={getStatusVariant(sol.status)}>{sol.status}</Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}