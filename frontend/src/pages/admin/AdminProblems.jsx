import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminProblemAPI } from "@/api/adminProblems";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AdminProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AdminProblemAPI.getAllProblems()
      .then(setProblems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin · Problem Review</h1>

      {problems.map((problem) => (
        <Card
          key={problem._id}
          className="p-4 cursor-pointer hover:bg-muted transition"
          onClick={() => navigate(`/admin/problems/${problem._id}`)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{problem.title}</h2>
              <p className="text-sm text-muted-foreground">
                by {problem.createdBy?.name}
              </p>
            </div>

            <Badge variant={statusVariant(problem.status)}>
              {problem.status}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

function statusVariant(status) {
  switch (status) {
    case "PENDING_REVIEW":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "destructive";
    case "PUBLISHED":
      return "secondary";
    default:
      return "outline";
  }
}
