import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProblemAPI } from "@/api/problems";
import { Button } from "@/components/ui/button";
import ProblemCard from "@/components/problems/ProblemCard"; // Import reusable card

export default function MyProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProblems = async () => {
    try {
      const data = await ProblemAPI.getMyProblems();
      const statusOrder = ["DRAFT", "PENDING_REVIEW", "APPROVED", "PUBLISHED", "REJECTED"];
      const sorted = [...data].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
      setProblems(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProblems(); }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading your challenges...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Problems</h1>
        <Button asChild>
          <Link to="/problems/create">Create Problem</Link>
        </Button>
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20">
          <p className="text-muted-foreground">No problems yet. Start by creating one.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {problems.map((p) => {
            const viewLink = p.status === "PUBLISHED" ? `/problems/${p.slug}` : `/problems/${p._id}/preview`;
            
            return (
              <ProblemCard 
                key={p._id} 
                problem={p} 
                onClick={() => navigate(viewLink)}
              >
                {/* Specific Actions for MyProblems page */}
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                   {(p.status === "DRAFT" || p.status === "REJECTED") && (
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/problems/edit/${p._id}`}>Edit</Link>
                    </Button>
                  )}
                  <Button asChild variant="secondary" size="sm">
                    <Link to={viewLink}>View</Link>
                  </Button>
                </div>
              </ProblemCard>
            );
          })}
        </div>
      )}
    </div>
  );
}