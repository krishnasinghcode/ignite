import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AdminSolutionAPI } from "@/api/adminSolutions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

// Assuming SolutionPresenter handles the writeup/links/tech rendering
import SolutionPresenter from "@/components/solutions/SolutionPresenter";

export default function AdminSolutionDetail() {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const [sol, setSol] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await AdminSolutionAPI.getSolutionById(solutionId);
      setSol(data);
      if (data.status === "REJECTED") setReason(data.rejectionReason || "");
    } catch (err) {
      console.error("Error fetching solution:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [solutionId]);

  const handleReview = async (decision) => {
    try {
      setIsSubmitting(true);
      await AdminSolutionAPI.reviewSolution(solutionId, {
        decision,
        rejectionReason: decision === "REJECT" ? reason : undefined,
      });
      setReason("");
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Review submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading submission...</div>;
  if (!sol) return <div className="p-10 text-center text-destructive">Solution not found.</div>;

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8 animate-in fade-in duration-500">
      {/* Admin Info Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-6">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Queue
          </Button>
          <h1 className="text-2xl font-bold">Reviewing Submission</h1>
          <p className="text-sm text-muted-foreground">
            User: <span className="font-medium text-foreground">{sol.userId?.name}</span> • 
            Challenge: <Link to={`/problems/${sol.problemId?.slug}`} className="text-primary hover:underline">{sol.problemId?.title}</Link>
          </p>
        </div>
        <Badge className={getStatusColor(sol.status)} variant="outline">
          {sol.status}
        </Badge>
      </div>

      {/* SOLUTION PRESENTER (Previewing the work) */}
      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-3 bg-muted/40 rounded-t-lg border-b text-[10px] font-bold uppercase tracking-tighter opacity-60">
          User Submission Content
        </div>
        <div className="p-6">
          <SolutionPresenter solution={sol} />
        </div>
      </div>

      {/* ADMIN CONTROLS */}
      <section className="pt-4">
        {sol.status !== "APPROVED" ? (
          <Card className="p-6 border-2 border-primary/20 shadow-lg space-y-4 bg-primary/5">
            <div className="space-y-1">
              <h3 className="font-bold text-lg">Reviewer Decision</h3>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Feedback is visible to the developer</p>
            </div>

            <Textarea
              placeholder="Provide feedback or rejection reasons..."
              className="min-h-[120px] bg-background"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex gap-4 pt-2">
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700" 
                onClick={() => handleReview("APPROVE")}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Approve & Publish"}
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                disabled={!reason.trim() || isSubmitting} 
                onClick={() => handleReview("REJECT")}
              >
                Reject Solution
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-emerald-50 border-emerald-200 border-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <h3 className="text-emerald-900 font-bold">Submission Verified</h3>
                <p className="text-emerald-700 text-sm">This solution is live and visible on the problem page.</p>
              </div>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "APPROVED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "REJECTED": return "bg-rose-100 text-rose-700 border-rose-200";
    case "SUBMITTED": return "bg-amber-100 text-amber-700 border-amber-200";
    default: return "bg-slate-100";
  }
}