import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminSolutionAPI } from "@/api/adminSolutions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AdminSolutionDetail() {
  const { solutionId } = useParams();
  const [sol, setSol] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await AdminSolutionAPI.getSolutionById(solutionId);
      setSol(data);
      // Pre-fill reason if it was already rejected so admin can edit the feedback
      if (data.status === "REJECTED") {
        setReason(data.rejectionReason || "");
      }
    } catch (err) {
      console.error("Error fetching solution:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [solutionId]);

  const handleReview = async (decision) => {
    try {
      setIsSubmitting(true);
      await AdminSolutionAPI.reviewSolution(solutionId, {
        decision,
        rejectionReason: decision === "REJECT" ? reason : undefined,
      });
      setReason("");
      await fetchData(); // Refresh data to show new status
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert(err.response?.data?.message || "Review submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "APPROVED": return "success";
      case "REJECTED": return "destructive";
      case "SUBMITTED": return "warning";
      default: return "secondary";
    }
  };

  if (loading) return <div className="p-10 text-center">Loading submission details...</div>;
  if (!sol) return <div className="p-10 text-center text-destructive">Solution not found.</div>;

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8">
      {/* Top Banner */}
      <div className="flex justify-between items-start border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Solution Review</h1>
            <Badge variant={getStatusVariant(sol.status)}>{sol.status}</Badge>
          </div>
          <p className="text-muted-foreground">
            Problem: <Link to={`/problems/${sol.problemId?.slug}`} className="text-primary hover:underline font-medium">{sol.problemId?.title}</Link>
          </p>
          <p className="text-sm">
            Submitted by: <span className="font-semibold">{sol.userId?.name}</span> ({sol.userId?.email})
          </p>
        </div>
        
        <div className="text-right text-xs text-muted-foreground">
          <p>Submitted: {new Date(sol.createdAt).toLocaleString()}</p>
          {sol.reviewedAt && <p>Reviewed: {new Date(sol.reviewedAt).toLocaleString()}</p>}
        </div>
      </div>

      {/* External Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-muted/20 border-dashed">
          <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Repository Link</p>
          <a href={sol.repositoryUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all font-mono text-sm">
            {sol.repositoryUrl}
          </a>
        </Card>
        {sol.liveDemoUrl && (
          <Card className="p-4 bg-muted/20 border-dashed">
            <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Live Demo</p>
            <a href={sol.liveDemoUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all font-mono text-sm">
              {sol.liveDemoUrl}
            </a>
          </Card>
        )}
      </div>

      {/* Tech Stack */}
      {sol.techStack?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Tech Stack Used</h3>
          <div className="flex flex-wrap gap-2">
            {sol.techStack.map(tech => (
              <Badge key={tech} variant="outline" className="bg-background">{tech}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* The Writeup */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold border-l-4 border-primary pl-3">Detailed Writeup</h3>
        <div className="grid gap-6">
          {Object.entries(sol.writeup || {}).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</p>
              <div className="p-5 bg-card border rounded-xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
                {value || <span className="italic text-muted-foreground">No information provided for this section.</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Actions - Hidden if already Approved */}
      {sol.status !== "APPROVED" ? (
        <Card className="p-6 border-2 border-primary/20 shadow-lg space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-lg">Submit Review Decision</h3>
            <p className="text-sm text-muted-foreground">
              {sol.status === "REJECTED" 
                ? "This was previously rejected. Approving it now will clear the rejection reason." 
                : "Provide feedback and decide whether this solution meets the requirements."}
            </p>
          </div>

          <Textarea
            placeholder="Feedback for the developer (Required if rejecting)..."
            className="min-h-[120px] bg-background"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex gap-4 pt-2">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
              onClick={() => handleReview("APPROVE")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Approve Solution"}
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
        <Card className="p-6 bg-green-50 border-green-200 border flex items-center justify-between">
          <div>
            <h3 className="text-green-800 font-bold">Solution Approved</h3>
            <p className="text-green-700 text-sm">This submission is now visible to the community.</p>
          </div>
          <Badge className="bg-green-600">Verified</Badge>
        </Card>
      )}
    </div>
  );
}