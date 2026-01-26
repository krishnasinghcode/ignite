import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSolutionAPI } from "@/api/adminSolutions";
import { Badge } from "@/components/ui/badge";
import SolutionCard from "@/components/solutions/SolutionCard";

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

  if (loading) return <div className="p-10 text-center animate-pulse">Loading submission queue...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Solution Review</h1>
        <p className="text-muted-foreground">Moderate and verify community submissions.</p>
      </div>

      <div className="flex flex-col gap-4">
        {solutions.map((sol) => (
          <div key={sol._id} className="relative group">
            {/* Admin-only status badge overlay */}
            <Badge 
              className={`absolute -top-2 -right-2 z-10 shadow-sm px-3 ${getStatusColor(sol.status)}`}
              variant="outline"
            >
              {sol.status}
            </Badge>

            <SolutionCard 
              sol={{
                ...sol,
                // On the admin list, we want to see WHO submitted and for WHICH problem
                userId: { name: `${sol.problemId?.title} by ${sol.userId?.name}` }
              }} 
              onView={(id) => navigate(`/admin/solutions/${id}`)}
              onUpvote={() => {}} // Disabled in admin list
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "SUBMITTED": return "bg-amber-100 text-amber-700 border-amber-200";
    case "APPROVED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "REJECTED": return "bg-rose-100 text-rose-700 border-rose-200";
    default: return "bg-secondary";
  }
}