import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminProblemAPI } from "@/api/adminProblems";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import ProblemPresenter from "@/components/problems/ProblemPresenter";

export default function AdminProblemDetail() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const data = await AdminProblemAPI.getAllProblems();
      const found = data.find((p) => p._id === problemId);
      setProblem(found || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProblem(); }, [problemId]);

  const review = async (decision) => {
    await AdminProblemAPI.reviewProblem(problemId, {
      decision,
      rejectionReason: decision === "REJECT" ? reason : undefined,
    });
    setReason("");
    fetchProblem();
  };

  const publish = async () => {
    await AdminProblemAPI.publishProblem(problemId);
    fetchProblem();
  };

  if (loading) return <div className="p-10 text-center">Loading for review...</div>;
  if (!problem) return <div className="p-10 text-center">Problem not found</div>;

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8 animate-in fade-in duration-500">
      {/* Admin Meta Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Review List
          </Button>
          <p className="text-sm text-muted-foreground">
            Submitted by: <span className="font-medium text-foreground">{problem.createdBy?.name}</span> ({problem.createdBy?.email})
          </p>
        </div>
        <Badge className={statusVariant(problem.status)} variant="outline">
          {problem.status}
        </Badge>
      </div>

      {/* THE ACTUAL CONTENT (How it will look to users) */}
      <div className="bg-card rounded-xl border p-2">
         <div className="p-4 bg-muted/30 rounded-t-lg border-b text-[10px] font-bold uppercase tracking-widest">Preview Mode</div>
         <div className="p-6">
            <ProblemPresenter problem={problem} showContent={true} />
         </div>
      </div>

      {/* Review Actions */}
      <div className="bg-secondary/10 p-6 rounded-xl border-2 border-dashed space-y-4">
        <h3 className="font-bold text-lg">Administrative Actions</h3>
        
        {problem.status === "PENDING_REVIEW" && (
          <div className="space-y-4">
            <Textarea
              placeholder="Provide feedback or rejection reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-background"
            />
            <div className="flex gap-3">
              <Button onClick={() => review("APPROVE")} className="bg-emerald-600 hover:bg-emerald-700">Approve Submission</Button>
              <Button
                variant="destructive"
                onClick={() => review("REJECT")}
                disabled={!reason.trim()}
              >
                Reject with Feedback
              </Button>
            </div>
          </div>
        )}

        {problem.status === "APPROVED" && (
          <Button size="lg" className="w-full" onClick={publish}>Make Public (Publish)</Button>
        )}

        {problem.status === "REJECTED" && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            <p className="font-bold">Rejection Feedback Sent:</p>
            <p className="text-sm">{problem.rejectionReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Utility for Admin colors
function statusVariant(status) {
  switch (status) {
    case "PENDING_REVIEW": return "text-amber-600 border-amber-200 bg-amber-50";
    case "APPROVED": return "text-emerald-600 border-emerald-200 bg-emerald-50";
    case "REJECTED": return "text-rose-600 border-rose-200 bg-rose-50";
    case "PUBLISHED": return "text-blue-600 border-blue-200 bg-blue-50";
    default: return "";
  }
}