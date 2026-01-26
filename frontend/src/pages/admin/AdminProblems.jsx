import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminProblemAPI } from "@/api/adminProblems";
import { Badge } from "@/components/ui/badge";
import ProblemCard from "@/components/problems/ProblemCard";

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

  if (loading) return <div className="p-10 text-center animate-pulse">Loading queue...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
          <p className="text-muted-foreground">Manage and moderate challenge submissions.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {problems.map((problem) => (
          <div key={problem._id} className="relative group">
            {/* Status floating badge specifically for Admin view */}
            <Badge 
              className={`absolute -top-2 -right-2 z-10 shadow-sm ${statusVariant(problem.status)}`}
              variant="outline"
            >
              {problem.status}
            </Badge>

            <ProblemCard 
              problem={problem} 
              onClick={() => navigate(`/admin/problems/${problem._id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function statusVariant(status) {
  switch (status) {
    case "PENDING_REVIEW": return "bg-amber-100 text-amber-700 border-amber-200";
    case "APPROVED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "REJECTED": return "bg-rose-100 text-rose-700 border-rose-200";
    case "PUBLISHED": return "bg-blue-100 text-blue-700 border-blue-200";
    default: return "bg-secondary";
  }
}