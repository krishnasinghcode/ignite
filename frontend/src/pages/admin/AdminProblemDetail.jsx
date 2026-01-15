import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminProblemAPI } from "@/api/adminProblems";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function AdminProblemDetail() {
  const { problemId } = useParams();

  const [problem, setProblem] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      setError(null);

      // fetch all problems and find by id (backend can also implement /:id)
      const data = await AdminProblemAPI.getAllProblems();
      const found = data.find((p) => p._id === problemId);

      if (!found) {
        setError("Problem not found");
        setProblem(null);
        return;
      }

      setProblem(found);
    } catch (err) {
      console.error(err);
      setError("Failed to load problem");
      setProblem(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

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

  if (loading) return <div className="p-6">Loading problem…</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;
  if (!problem) return <div className="p-6">Problem not found</div>;

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Created by {problem.createdBy?.name} ({problem.createdBy?.email})
          </p>
          <p className="text-sm text-muted-foreground">
            Domain: {problem.domain} · Difficulty: {problem.difficulty} · Status: {problem.status}
          </p>
        </div>

        <Badge variant={statusVariant(problem.status)}>
          {problem.status}
        </Badge>
      </div>

      {/* Summary */}
      <div>
        <h3 className="font-semibold">Summary</h3>
        <p className="text-sm">{problem.summary}</p>
      </div>

      {/* Full Description */}
      <div>
        <h3 className="font-semibold">Description</h3>
        <pre className="whitespace-pre-wrap text-sm rounded bg-muted p-4 overflow-auto">
          {problem.description}
        </pre>
      </div>

      {/* Context */}
      <div>
        <h3 className="font-semibold">Context</h3>
        <pre className="whitespace-pre-wrap text-sm rounded bg-muted p-4 overflow-auto">
          {problem.context}
        </pre>
      </div>

      {/* Objectives */}
      {problem.objectives?.length > 0 && (
        <div>
          <h3 className="font-semibold">Objectives</h3>
          <ul className="list-disc list-inside text-sm">
            {problem.objectives.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
      )}

      {/* Constraints */}
      {problem.constraints?.length > 0 && (
        <div>
          <h3 className="font-semibold">Constraints</h3>
          <ul className="list-disc list-inside text-sm">
            {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      {/* Assumptions */}
      {problem.assumptions?.length > 0 && (
        <div>
          <h3 className="font-semibold">Assumptions</h3>
          <ul className="list-disc list-inside text-sm">
            {problem.assumptions.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      )}

      {/* Expected Deliverables */}
      {problem.expectedDeliverables?.length > 0 && (
        <div>
          <h3 className="font-semibold">Expected Deliverables</h3>
          <ul className="list-disc list-inside text-sm">
            {problem.expectedDeliverables.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      )}

      {/* Evaluation Criteria */}
      {problem.evaluationCriteria?.length > 0 && (
        <div>
          <h3 className="font-semibold">Evaluation Criteria</h3>
          <ul className="list-disc list-inside text-sm">
            {problem.evaluationCriteria.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* Tags */}
      {problem.tags?.length > 0 && (
        <div>
          <h3 className="font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {problem.tags.map((t, i) => (
              <Badge key={i} variant="secondary">{t}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="text-sm text-muted-foreground">
        <p>Created At: {new Date(problem.createdAt).toLocaleString()}</p>
        <p>Last Updated: {new Date(problem.updatedAt).toLocaleString()}</p>
      </div>

      {/* Review actions */}
      {problem.status === "PENDING_REVIEW" && (
        <div className="space-y-4">
          <h3 className="font-semibold">Review Decision</h3>
          <Textarea
            placeholder="Rejection reason (required if rejecting)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex gap-3">
            <Button onClick={() => review("APPROVE")}>Approve</Button>
            <Button
              variant="destructive"
              onClick={() => review("REJECT")}
              disabled={!reason.trim()}
            >
              Reject
            </Button>
          </div>
        </div>
      )}

      {/* Publish */}
      {problem.status === "APPROVED" && (
        <Button onClick={publish}>Publish Problem</Button>
      )}

      {/* Rejection reason */}
      {problem.status === "REJECTED" && problem.rejectionReason && (
        <div className="rounded border border-destructive p-4">
          <h3 className="font-semibold text-destructive">Rejection Reason</h3>
          <p className="mt-1 text-sm">{problem.rejectionReason}</p>
        </div>
      )}
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
